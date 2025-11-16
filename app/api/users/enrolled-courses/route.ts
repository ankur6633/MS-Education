import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';

// GET /api/users/enrolled-courses - Get all enrolled courses for the current user
export async function GET(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Unauthorized - Email required' },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get enrolled course IDs - ensure it's an array
    const enrolledCourseIds = Array.isArray(user.enrolledCourses) 
      ? user.enrolledCourses 
      : [];

    if (enrolledCourseIds.length === 0) {
      return NextResponse.json({
        success: true,
        courses: []
      });
    }

    // Fetch all enrolled courses with details
    const enrolledCourses = await Course.find({
      _id: { $in: enrolledCourseIds }
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      courses: enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

