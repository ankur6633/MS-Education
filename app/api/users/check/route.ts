import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');
    
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
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
