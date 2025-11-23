import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import EmailOTP from '@/lib/models/EmailOTP';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, otp, newPassword } = await request.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email, OTP and new password are required' }, { status: 400 });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();
    const record = await EmailOTP.findOne({ email: normalizedEmail });
    if (!record) {
      return NextResponse.json({ success: false, error: 'OTP not found or expired' }, { status: 404 });
    }
    if (new Date() > record.expiry) {
      await EmailOTP.deleteOne({ email: normalizedEmail });
      return NextResponse.json({ success: false, error: 'OTP has expired' }, { status: 410 });
    }
    if (record.otp !== String(otp)) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    // Simple assignment; in production hash the password
    user.password = newPassword;
    await user.save();
    await EmailOTP.deleteOne({ email: normalizedEmail });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


