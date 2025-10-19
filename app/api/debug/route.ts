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
  });
}
