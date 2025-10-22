import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';

// GET /api/courses/[id] - Get a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      theme,
      discount
    } = body;

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Update course fields
    if (title) course.title = title;
    if (hindiTitle) course.hindiTitle = hindiTitle;
    if (description) course.description = description;
    if (thumbnail) course.thumbnail = thumbnail;
    if (typeof isPaid === 'boolean') course.isPaid = isPaid;
    if (currentPrice !== undefined) course.currentPrice = currentPrice;
    if (originalPrice !== undefined) course.originalPrice = originalPrice;
    if (discount !== undefined) course.discount = discount;
    if (duration) course.duration = duration;
    if (students) course.students = students;
    if (rating !== undefined) course.rating = rating;
    if (reviews !== undefined) course.reviews = reviews;
    if (features) course.features = features;
    if (badge) course.badge = badge;
    if (badgeColor) course.badgeColor = badgeColor;
    if (image) course.image = image;
    if (theme) course.theme = theme;

    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // TODO: Delete associated files from Cloudinary
    // This would require extracting public IDs from the URLs

    await Course.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
