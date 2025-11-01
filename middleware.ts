import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const res = NextResponse.next();

    const callbackCookie = req.cookies.get('next-auth.callback-url');
    if (callbackCookie?.value) {
      let normalized = callbackCookie.value;
      try {
        const parsed = new URL(callbackCookie.value);
        normalized = parsed.origin + parsed.pathname;
      } catch {
        normalized = 'http://localhost:3000';
      }

      if (!normalized.startsWith('http://localhost:3000')) {
        normalized = 'http://localhost:3000';
      }

      if (normalized !== callbackCookie.value) {
        res.cookies.set('next-auth.callback-url', normalized, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
        });
      }
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the user is trying to access admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Allow access to login page
          if (req.nextUrl.pathname === '/admin/login') {
            return true;
          }
          // For other admin routes, check if user is authenticated and is admin
          return !!token && token.role === 'admin';
        }
        // Allow access to all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*']
};
