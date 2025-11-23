import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
const oauthClient = clientId ? new OAuth2Client(clientId) : null;

function toTenDigitUnique(sub: string): string {
  let acc = '';
  for (let i = 0; i < sub.length && acc.length < 10; i++) {
    const code = sub.charCodeAt(i) % 10;
    acc += String(code);
  }
  while (acc.length < 10) acc += '7';
  return acc.slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    if (!oauthClient) {
      return new NextResponse(
        '<html><body><script>window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: "Google client ID not configured" }, "*"); window.close();</script></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const idToken = searchParams.get('id_token');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return new NextResponse(
        `<html><body><script>window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: "${error}" }, "*"); window.close();</script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!idToken) {
      return new NextResponse(
        '<html><body><script>window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: "No token received" }, "*"); window.close();</script></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    await dbConnect();

    // Verify token
    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: clientId,
    });
    
    const payload = ticket.getPayload() as TokenPayload | undefined;
    if (!payload || !payload.email) {
      return new NextResponse(
        '<html><body><script>window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: "Invalid Google token" }, "*"); window.close();</script></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    const email = (payload.email || '').toLowerCase();
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture;
    const sub = payload.sub || email;

    // Find or create user
    let user = await User.findOne({ email });
    const isNewUser = !user;
    
    if (!user) {
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
    } else {
      if (picture && (!(user as any).profileImage || (user as any).profileImage !== picture)) {
        (user as any).profileImage = picture;
        await user.save();
      }
    }

    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileImage: (user as any).profileImage,
    };

    // Send success message to opener window
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({ 
          type: "GOOGLE_AUTH_SUCCESS", 
          user: ${JSON.stringify(userData)}, 
          isNewUser: ${isNewUser} 
        }, "*");
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Google callback error:', error);
    return new NextResponse(
      `<html><body><script>window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: "Internal server error" }, "*"); window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

