import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import otpService from '@/lib/otp-service';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { mobile, otp } = await request.json();
    
    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
    }

    // Verify OTP using database service
    const verification = await otpService.verifyOTP(mobile, otp);
    
    if (!verification.success) {
      return NextResponse.json({ error: verification.message }, { status: 400 });
    }

    // OTP is valid, check if user exists
    const user = await User.findOne({ mobile });
    
    if (user) {
      // User exists, login successful
      return NextResponse.json({ 
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        },
        message: 'Login successful'
      });
    } else {
      // User doesn't exist, return success but indicate registration needed
      return NextResponse.json({ 
        success: true,
        needsRegistration: true,
        mobile: mobile,
        message: 'OTP verified. Please complete registration.'
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
