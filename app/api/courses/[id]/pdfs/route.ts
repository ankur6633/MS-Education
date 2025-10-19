import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import { uploadToCloudinary } from '@/lib/cloudinary';

// POST /api/courses/[id]/pdfs - Add a PDF to a course
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Upload PDF to Cloudinary
    const uploadResult = await uploadToCloudinary(file, 'mseducation/pdfs') as any;

    // Add PDF to course
    const newPDF = {
      title,
      url: uploadResult.secure_url,
      order: course.pdfs.length
    };

    course.pdfs.push(newPDF);
    await course.save();

    return NextResponse.json({ 
      message: 'PDF uploaded successfully',
      pdf: newPDF
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
