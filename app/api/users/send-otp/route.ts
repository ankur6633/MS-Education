import { NextRequest, NextResponse } from 'next/server';
import otpService from '@/lib/otp-service';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();
    
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database with 5-minute expiry
    await otpService.setOTP(mobile, otp, 5);

    // In a real application, you would send SMS here using services like:
    // - Twilio
    // - AWS SNS
    // - Firebase Auth
    // - Custom SMS gateway
    
    // For now, we'll just log it to console
    console.log(`OTP for ${mobile}: ${otp}`);

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent successfully',
      // Don't send OTP in response in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
