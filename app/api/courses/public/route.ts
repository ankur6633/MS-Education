import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';

// GET /api/courses/public - Get all courses for public display
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
