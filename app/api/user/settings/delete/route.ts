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

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmDelete: z.boolean().refine(val => val === true, 'Please confirm account deletion'),
});

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = deleteAccountSchema.safeParse(body);
    
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

    // Verify password
    const isPasswordValid = user.password === parsed.data.password;
    let passwordValid = isPasswordValid;
    
    // Try bcrypt if simple comparison fails
    if (!passwordValid && user.password.startsWith('$2')) {
      const bcrypt = require('bcryptjs');
      passwordValid = await bcrypt.compare(parsed.data.password, user.password);
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Soft delete: Mark user as deleted (we'll add a deletedAt field or use a flag)
    // For now, we'll do a hard delete. In production, you might want to soft delete
    await User.findByIdAndDelete(user._id);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

