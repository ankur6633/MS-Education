import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// DELETE /api/courses/[id]/pdfs/[pdfIndex] - Delete a PDF from a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; pdfIndex: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const pdfIndex = parseInt(params.pdfIndex);
    
    if (pdfIndex < 0 || pdfIndex >= course.pdfs.length) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdf = course.pdfs[pdfIndex];
    
    // Extract public ID from Cloudinary URL
    const urlParts = pdf.url.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    const folder = 'mseducation/pdfs';
    const fullPublicId = `${folder}/${publicId}`;

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(fullPublicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Remove PDF from course
    course.pdfs.splice(pdfIndex, 1);
    
    // Update order of remaining PDFs
    course.pdfs.forEach((pdf, index) => {
      pdf.order = index;
    });

    await course.save();

    return NextResponse.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
