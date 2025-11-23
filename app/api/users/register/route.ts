import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import EmailOTP from '@/lib/models/EmailOTP';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const step = body?.step as 'send_otp' | 'verify_otp' | 'create_account' | undefined;

    // Backward-compatible full create if no step provided
    if (!step) {
      const { name, email, mobile, password } = body;
      if (!name || !email || !mobile || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
      const existingByEmail = await User.findOne({ email });
      if (existingByEmail) {
        return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
      }
      const existingByMobile = await User.findOne({ mobile });
      if (existingByMobile) {
        return NextResponse.json({ success: false, error: 'A user with this mobile number already exists' }, { status: 409 });
      }
      const user = new User({ name, email, mobile, password });
      await user.save();
      return NextResponse.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
    }

    if (step === 'send_otp') {
      // Recommend calling /api/users/send-email-otp directly on client
      return NextResponse.json({ success: false, error: 'Use /api/users/send-email-otp for sending OTP' }, { status: 400 });
    }

    if (step === 'verify_otp') {
      const { email, otp } = body;
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
      if (record.otp !== String(otp)) {
        record.attempts += 1;
        await record.save();
        return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 });
      }
      await EmailOTP.deleteOne({ email: normalizedEmail });
      return NextResponse.json({ success: true });
    }

    if (step === 'create_account') {
      const { email, name, mobile, password } = body;
      if (!email || !name || !mobile || !password) {
        return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
      }
      const existingByEmail = await User.findOne({ email });
      if (existingByEmail) {
        return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
      }
      const existingByMobile = await User.findOne({ mobile });
      if (existingByMobile) {
        return NextResponse.json({ success: false, error: 'A user with this mobile number already exists' }, { status: 409 });
      }
      const user = new User({ name, email, mobile, password });
      await user.save();
      return NextResponse.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
    }

    return NextResponse.json({ success: false, error: 'Invalid step' }, { status: 400 });
  } catch (error) {
    console.error('Error during registration:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
}
