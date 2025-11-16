import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmailOTP from '@/lib/models/EmailOTP';
import { emailService } from '@/lib/email-service';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // Quick SMTP sanity check in development to surface config errors early
    if (process.env.NODE_ENV !== 'production') {
      const ok = await emailService.verifyConnection();
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'Email transport not configured correctly. Check EMAIL_USER and EMAIL_PASSWORD (no spaces).' },
          { status: 500 }
        );
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await EmailOTP.deleteOne({ email: normalizedEmail });
    await EmailOTP.create({ email: normalizedEmail, otp, expiry, attempts: 0 });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
        <h2>MS Education - Email Verification</h2>
        <p>Your verification OTP is:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:4px;background:#f5f5f5;padding:12px 16px;display:inline-block;border-radius:8px;">
          ${otp}
        </div>
        <p style="margin-top:12px">This code will expire in 5 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `;
    const sent = await emailService.sendEmail({
      to: normalizedEmail,
      subject: 'Your MS Education verification code',
      html,
    });

    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


