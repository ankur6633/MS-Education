import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// DELETE /api/courses/[id]/videos/[videoIndex] - Delete a video from a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; videoIndex: string } }
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

    const videoIndex = parseInt(params.videoIndex);
    
    if (videoIndex < 0 || videoIndex >= course.videos.length) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = course.videos[videoIndex];
    
    // Extract public ID from Cloudinary URL
    const urlParts = video.url.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    const folder = 'mseducation/videos';
    const fullPublicId = `${folder}/${publicId}`;

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(fullPublicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Remove video from course
    course.videos.splice(videoIndex, 1);
    
    // Update order of remaining videos
    course.videos.forEach((video, index) => {
      video.order = index;
    });

    await course.save();

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
