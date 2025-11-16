import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { identifier, email, mobile, password } = await request.json();
    const providedIdentifier = identifier || email || mobile;

    if (!providedIdentifier || !password) {
      return NextResponse.json({ error: 'Identifier and password are required' }, { status: 400 });
    }

    // Determine if identifier is email or mobile (digits => mobile)
    const idStr: string = String(providedIdentifier).trim();
    const isEmail = idStr.includes('@');

    const user = await User.findOne(
      isEmail ? { email: idStr.toLowerCase() } : { mobile: idStr }
    );

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    // In a real application, you would hash the password and compare hashes
    // For now, we'll do a simple string comparison
    if (user.password !== password) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid password' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
