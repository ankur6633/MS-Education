import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { mobile } = await request.json();
    
    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const user = await User.findOne({ mobile });
    
    return NextResponse.json({ 
      exists: !!user,
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      } : null
    });
  } catch (error) {
    console.error('Error checking user by mobile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
