const { NextRequest, NextResponse } = require('next/server');
const { getServerSession } = require('next-auth');
const { authOptions } = require('../../lib/auth');
const dbConnect = require('../../lib/db');
const Course = require('../../lib/models/Course');

// GET /api/courses - Get all courses
async function GET(request) {
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
async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { title, description, thumbnail, isPaid } = body;

    if (!title || !description || !thumbnail) {
      return NextResponse.json(
        { error: 'Title, description, and thumbnail are required' },
        { status: 400 }
      );
    }

    const course = new Course({
      title,
      description,
      thumbnail,
      isPaid: isPaid || false,
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

module.exports = { GET, POST };
