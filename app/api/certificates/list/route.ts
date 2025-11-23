import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

// Helper to extract email from header
async function getRequestEmail(request: NextRequest): Promise<string | null> {
  const headerEmail = request.headers.get('x-user-email');
  if (headerEmail) return headerEmail;
  
  const { searchParams } = new URL(request.url);
  const queryEmail = searchParams.get('email');
  if (queryEmail) return queryEmail;
  
  return null;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Get user ID from email
    const User = (await import('@/lib/models/User')).default;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Fetch certificates
    const certificates = await Certificate.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('courseId', 'title thumbnail description')
      .lean();

    const total = await Certificate.countDocuments({ userId: user._id });

    return NextResponse.json({
      success: true,
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

