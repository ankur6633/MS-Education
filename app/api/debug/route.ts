import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or for debugging
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    // Don't expose secrets in response
    nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    // Email diagnostics (sanitized for safety)
    email: {
      hasHost: !!process.env.EMAIL_HOST,
      host: process.env.EMAIL_HOST || undefined,
      port: process.env.EMAIL_PORT || undefined,
      secure: process.env.EMAIL_SECURE || undefined,
      hasUser: !!process.env.EMAIL_USER,
      user: process.env.EMAIL_USER || undefined,
      hasPassword: !!(process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS),
      passwordLength: (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)?.length || 0,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || undefined,
      fromName: process.env.EMAIL_FROM_NAME || undefined,
    },
  });
}
