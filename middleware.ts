import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Normalize NextAuth callbackUrl to a single origin to avoid mixed hosts in dev
    const url = req.nextUrl
    if (url.pathname.startsWith('/api/auth')) {
      const callbackUrl = url.searchParams.get('callbackUrl')
      if (callbackUrl) {
        try {
          const isDev = process.env.NODE_ENV !== 'production'
          const desiredOrigin = isDev ? 'http://localhost:3000' : url.origin
          const parsed = new URL(callbackUrl, desiredOrigin)
          // Force origin and keep path/query
          const normalized = new URL(parsed.pathname + parsed.search + parsed.hash, desiredOrigin)
          if (callbackUrl !== normalized.toString()) {
            const next = new URL(url.toString())
            next.searchParams.set('callbackUrl', normalized.toString())
            return NextResponse.redirect(next)
          }
        } catch {
          const isDev = process.env.NODE_ENV !== 'production'
          const desiredOrigin = isDev ? 'http://localhost:3000' : url.origin
          const next = new URL(url.toString())
          next.searchParams.set('callbackUrl', desiredOrigin)
          return NextResponse.redirect(next)
        }
      }
    }
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
