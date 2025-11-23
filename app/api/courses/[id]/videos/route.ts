import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import Update from '@/lib/models/Update';
import User from '@/lib/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';

// POST /api/courses/[id]/videos - Add a video to a course
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
    const duration = parseInt(formData.get('duration') as string);

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

    // Upload video to Cloudinary
    const uploadResult = await uploadToCloudinary(file, 'mseducation/videos') as any;

    // Add video to course
    const newVideo = {
      title,
      url: uploadResult.secure_url,
      duration: duration || 0,
      order: course.videos.length
    };

    course.videos.push(newVideo);
    await course.save();

    // Create update entry for new lesson
    try {
      // Try to find admin user, or create a system user reference
      let adminUser = await User.findOne({ email: session.user.email });
      if (!adminUser) {
        // If admin doesn't exist in User collection, use the first user or create a placeholder
        adminUser = await User.findOne() || await User.create({
          name: 'System Admin',
          email: session.user.email || 'admin@mseducation.com',
          mobile: '0000000000',
          password: 'system'
        });
      }
      if (adminUser) {
        await Update.create({
          title: `New Lesson Added: ${title}`,
          description: `A new lesson "${title}" has been added to the course "${course.title}".`,
          type: 'lesson_added',
          createdBy: adminUser._id,
          courseId: course._id,
          image: course.thumbnail,
          redirectUrl: `/courses/${course._id}`
        });
      }
    } catch (updateError) {
      console.error('Error creating update entry:', updateError);
      // Don't fail the video upload if update creation fails
    }

    return NextResponse.json({ 
      message: 'Video uploaded successfully',
      video: newVideo
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
