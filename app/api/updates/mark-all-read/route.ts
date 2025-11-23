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

export async function POST(request: NextRequest) {
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

    // Get all update IDs
    const allUpdates = await Update.find().select('_id').lean() as any[];
    const updateIds = allUpdates.map(u => u._id);

    // Get already read updates
    const readUpdates = await UpdateRead.find({ userId: user._id }).select('updateId').lean() as any[];
    const readIdsSet = new Set(readUpdates.map(r => r.updateId.toString()));

    // Mark all unread updates as read
    const unreadIds = updateIds.filter(id => !readIdsSet.has(id.toString()));
    
    if (unreadIds.length > 0) {
      const readRecords = unreadIds.map(updateId => ({
        userId: user._id,
        updateId,
        readAt: new Date()
      }));
      
      await UpdateRead.insertMany(readRecords);
    }

    return NextResponse.json({
      success: true,
      message: `Marked ${unreadIds.length} update(s) as read`
    });
  } catch (error) {
    console.error('Error marking all updates as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

