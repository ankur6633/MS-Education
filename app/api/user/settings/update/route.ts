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

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  mobile: z.string().regex(/^\d{10}$/).optional(),
  profileImage: z.string().url().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    
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

    // Update fields
    if (parsed.data.name) user.name = parsed.data.name;
    if (parsed.data.profileImage) (user as any).profileImage = parsed.data.profileImage;
    
    // Handle email change
    if (parsed.data.email && parsed.data.email !== user.email) {
      const existing = await User.findOne({ email: parsed.data.email });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email already in use' },
          { status: 409 }
        );
      }
      user.email = parsed.data.email;
    }

    // Handle mobile change
    if (parsed.data.mobile && parsed.data.mobile !== user.mobile) {
      const existing = await User.findOne({ mobile: parsed.data.mobile });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Mobile number already in use' },
          { status: 409 }
        );
      }
      user.mobile = parsed.data.mobile;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: (user as any).profileImage
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

