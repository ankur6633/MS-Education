import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UpdateRead from '@/lib/models/UpdateRead';
import { z } from 'zod';

// Helper to extract email from header
async function getRequestEmail(request: NextRequest): Promise<string | null> {
  const headerEmail = request.headers.get('x-user-email');
  if (headerEmail) return headerEmail;
  
  const { searchParams } = new URL(request.url);
  const queryEmail = searchParams.get('email');
  if (queryEmail) return queryEmail;
  
  return null;
}

const markReadSchema = z.object({
  updateId: z.string().min(1, 'Update ID is required'),
});

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

    const body = await request.json();
    const parsed = markReadSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    // Check if already marked as read
    const existing = await UpdateRead.findOne({
      userId: user._id,
      updateId: parsed.data.updateId
    });

    if (!existing) {
      await UpdateRead.create({
        userId: user._id,
        updateId: parsed.data.updateId,
        readAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Update marked as read'
    });
  } catch (error) {
    console.error('Error marking update as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

