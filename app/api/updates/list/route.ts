import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Update from '@/lib/models/Update';
import UpdateRead from '@/lib/models/UpdateRead';

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

    // Fetch updates
    const updates = await Update.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('courseId', 'title thumbnail')
      .lean() as any[];

    // Get read status for user
    const readUpdateIds = await UpdateRead.find({ userId: user._id })
      .select('updateId')
      .lean() as any[];
    const readIdsSet = new Set(readUpdateIds.map(r => r.updateId.toString()));

    // Mark updates as read/unread
    const updatesWithReadStatus = updates.map(update => ({
      ...update,
      isRead: readIdsSet.has(update._id.toString())
    }));

    const total = await Update.countDocuments();

    return NextResponse.json({
      success: true,
      updates: updatesWithReadStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

