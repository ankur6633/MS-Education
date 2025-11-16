import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Ensure Edge runtime has sane dev defaults for NextAuth secret
if (process.env.NODE_ENV === 'development') {
  process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me-in-production';
}

export async function middleware(req: any) {
  const { pathname, origin } = req.nextUrl;

  // Only protect admin routes (except the login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
      });

      if (!token || (token as any).role !== 'admin') {
        const loginUrl = new URL('/admin/login', origin);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/admin/login', origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
