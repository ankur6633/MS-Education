import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
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

const preferencesSchema = z.object({
  notificationsEnabled: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.string().max(10).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        notificationsEnabled: (user as any).notificationsEnabled ?? true,
        theme: (user as any).theme ?? 'light',
        language: (user as any).language ?? 'en',
        googleConnected: (user as any).googleConnected ?? false
      }
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update preferences
    if (parsed.data.notificationsEnabled !== undefined) {
      (user as any).notificationsEnabled = parsed.data.notificationsEnabled;
    }
    if (parsed.data.theme) {
      (user as any).theme = parsed.data.theme;
    }
    if (parsed.data.language) {
      (user as any).language = parsed.data.language;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      preferences: {
        notificationsEnabled: (user as any).notificationsEnabled ?? true,
        theme: (user as any).theme ?? 'light',
        language: (user as any).language ?? 'en',
        googleConnected: (user as any).googleConnected ?? false
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

