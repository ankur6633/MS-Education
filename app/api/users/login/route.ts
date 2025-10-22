import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    
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
