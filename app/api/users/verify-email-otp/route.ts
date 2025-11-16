import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmailOTP from '@/lib/models/EmailOTP';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
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

    if (record.attempts >= 5) {
      await EmailOTP.deleteOne({ email: normalizedEmail });
      return NextResponse.json({ success: false, error: 'Too many attempts. Please request a new OTP.' }, { status: 429 });
    }

    if (record.otp !== String(otp)) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 });
    }

    await EmailOTP.deleteOne({ email: normalizedEmail });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


