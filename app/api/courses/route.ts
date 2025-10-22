import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const courses = await Course.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Course.countDocuments(searchQuery);

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { 
      title, 
      hindiTitle, 
      description, 
      thumbnail, 
      isPaid, 
      currentPrice, 
      originalPrice, 
      duration, 
      students, 
      rating, 
      reviews, 
      features, 
      badge, 
      badgeColor, 
      image, 
      theme 
    } = body;

    if (!title || !hindiTitle || !description || !thumbnail || !duration || !students || !rating || !reviews || !features) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Calculate discount if both prices are provided
    let discount = undefined;
    if (isPaid && currentPrice && originalPrice && originalPrice > currentPrice) {
      discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    const course = new Course({
      title,
      hindiTitle,
      description,
      thumbnail,
      isPaid: isPaid || false,
      currentPrice: isPaid ? currentPrice : undefined,
      originalPrice: isPaid ? originalPrice : undefined,
      discount,
      duration,
      students,
      rating,
      reviews,
      features,
      badge: badge || 'NEW',
      badgeColor: badgeColor || 'bg-blue-500',
      image: image || '📚',
      theme: theme || 'default',
      videos: [],
      pdfs: []
    });

    await course.save();

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
