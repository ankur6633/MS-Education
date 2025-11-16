import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

// POST /api/courses/[id]/enroll - Enroll user in a course
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Try to get email from session first
    let userEmail: string | null = null;
    let requestBody: any = null;
    
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        userEmail = session.user.email;
      }
    } catch (error) {
      // Session not available, try to get from request body
    }

    // If no session, try to get email from request body
    if (!userEmail) {
      try {
        requestBody = await request.json();
        userEmail = requestBody?.email || null;
      } catch (error) {
        // No body or invalid JSON
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert course ID to ObjectId
    const courseObjectId = new mongoose.Types.ObjectId(params.id);
    const courseIdString = params.id;
    
    // Ensure enrolledCourses is an array (initialize if undefined or null)
    if (!Array.isArray(user.enrolledCourses)) {
      user.enrolledCourses = [];
    }
    
    // Check if user is already enrolled
    const isAlreadyEnrolled = user.enrolledCourses.some((courseId: any) => {
      if (!courseId) return false;
      try {
        const idString = typeof courseId === 'string' 
          ? courseId 
          : courseId.toString ? courseId.toString() : String(courseId);
        return idString === courseIdString;
      } catch (error) {
        console.error('Error comparing course ID:', error);
        return false;
      }
    });
    
    if (isAlreadyEnrolled) {
      return NextResponse.json({ 
        message: 'Already enrolled',
        enrolled: true 
      });
    }
    
    // Add course to enrolled courses
    user.enrolledCourses.push(courseObjectId);
    
    // Save user to database
    try {
      await user.save();
      console.log(`✅ User ${userEmail} enrolled in course ${params.id}`);
      console.log(`📚 Total enrolled courses: ${user.enrolledCourses.length}`);
    } catch (saveError) {
      console.error('❌ Error saving enrollment:', saveError);
      console.error('Save error details:', {
        message: saveError instanceof Error ? saveError.message : 'Unknown error',
        stack: saveError instanceof Error ? saveError.stack : undefined
      });
      return NextResponse.json(
        { error: 'Failed to save enrollment to database' },
        { status: 500 }
      );
    }

    // Verify the enrollment was saved by fetching user again
    try {
      const savedUser = await User.findById(user._id);
      if (savedUser) {
        const savedEnrolledCourses = Array.isArray(savedUser.enrolledCourses) 
          ? savedUser.enrolledCourses 
          : [];
        const isSaved = savedEnrolledCourses.some((courseId: any) => {
          if (!courseId) return false;
          try {
            const idString = typeof courseId === 'string' 
              ? courseId 
              : courseId.toString ? courseId.toString() : String(courseId);
            return idString === courseIdString;
          } catch (error) {
            return false;
          }
        });

        if (isSaved) {
          console.log(`✅ Verified: Course ${params.id} is saved in user's enrolled courses`);
        } else {
          console.warn(`⚠️ Warning: Course ${params.id} might not be saved correctly`);
        }
      }
    } catch (verifyError) {
      console.error('Error verifying enrollment:', verifyError);
      // Don't fail the request if verification fails
    }
    
    return NextResponse.json({ 
      message: 'Enrollment successful',
      enrolled: true,
      courseId: params.id,
      success: true
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/courses/[id]/enroll - Check enrollment status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Try to get email from session first
    let userEmail: string | null = null;
    
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        userEmail = session.user.email;
      }
    } catch (error) {
      // Session not available, try to get from query params
    }

    // If no session, try to get email from query params
    if (!userEmail) {
      const { searchParams } = new URL(request.url);
      userEmail = searchParams.get('email');
    }

    if (!userEmail) {
      return NextResponse.json({ enrolled: false });
    }

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ enrolled: false });
    }

    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json({ enrolled: false });
    }

    // Check enrollment by converting ObjectIds to strings for comparison
    // Ensure enrolledCourses is an array
    const enrolledCourses = Array.isArray(user.enrolledCourses) 
      ? user.enrolledCourses 
      : [];
    
    const courseIdString = params.id;
    const isEnrolled = enrolledCourses.some((courseId: any) => {
      if (!courseId) return false;
      try {
        const idString = typeof courseId === 'string' 
          ? courseId 
          : courseId.toString ? courseId.toString() : String(courseId);
        return idString === courseIdString;
      } catch (error) {
        console.error('Error comparing course ID in GET:', error);
        return false;
      }
    });

    return NextResponse.json({ enrolled: isEnrolled });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json({ enrolled: false });
  }
}

