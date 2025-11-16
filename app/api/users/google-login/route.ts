import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
const oauthClient = clientId ? new OAuth2Client(clientId) : null;

function toTenDigitUnique(sub: string): string {
  // Derive a pseudo-unique 10-digit mobile from Google sub (not used for communication)
  // Take digits from char codes
  let acc = '';
  for (let i = 0; i < sub.length && acc.length < 10; i++) {
    const code = sub.charCodeAt(i) % 10;
    acc += String(code);
  }
  while (acc.length < 10) acc += '7';
  return acc.slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    if (!oauthClient) {
      return NextResponse.json({ success: false, error: 'Google client ID not configured' }, { status: 500 });
    }
    await connectDB();
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ success: false, error: 'idToken is required' }, { status: 400 });
    }

    // Verify token
    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload() as TokenPayload | undefined;
    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, error: 'Invalid Google token' }, { status: 401 });
    }

    const email = (payload.email || '').toLowerCase();
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture;
    const sub = payload.sub || email;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user with placeholder unique mobile and random password
      const mobile = toTenDigitUnique(sub);
      const password = `google_${sub}`;
      user = new User({
        name,
        email,
        mobile,
        password,
        profileImage: picture,
      });
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: (user as any).profileImage,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


