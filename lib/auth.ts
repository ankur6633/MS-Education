import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Set development defaults only in non-production
if (process.env.NODE_ENV === 'development') {
  const origin = 'http://localhost:3000';
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || origin;
  process.env.NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL_INTERNAL || origin;
  
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'dev-secret-change-me-in-production';
    console.warn('⚠️  Using default NEXTAUTH_SECRET for development. Set a secure secret in production!');
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@mseducation.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Hello$@';

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: '1',
            email: credentials.email,
            role: 'admin'
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token) return session;
      // Ensure session.user exists before assigning custom fields
      const user = (session.user || {}) as any;
      user.id = token.sub || '';
      if (token.role) user.role = token.role;
      if (token.email) user.email = token.email;
      (session as any).user = user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        // If NextAuth didn't provide a baseUrl, fall back to root
        if (!baseUrl) return '/';
        // Allow relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        const to = new URL(url);
        const base = new URL(baseUrl);
        // Allow same-origin URLs
        if (to.origin === base.origin) return url;
      } catch {}
      // Fallback to base URL to avoid malformed concatenation
      return baseUrl || '/';
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Fix callback URL issues in development
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token` 
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
