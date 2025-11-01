import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch only courses where showInCarousel is true
    const courses = await Course.find({ showInCarousel: true })
      .select('title hindiTitle description thumbnail isPaid currentPrice originalPrice discount duration students rating reviews features badge badgeColor image theme')
      .sort({ createdAt: -1 })
      .limit(10) // Limit to 10 courses for the carousel
      .lean();

    return NextResponse.json({ 
      success: true,
      courses 
    });
  } catch (error) {
    console.error('Error fetching carousel courses:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch carousel courses' 
      },
      { status: 500 }
    );
  }
}
