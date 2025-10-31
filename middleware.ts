import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
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
  matcher: ['/admin/:path*']
};
