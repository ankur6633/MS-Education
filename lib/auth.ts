import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Ensure required NextAuth env is set to prevent 500s in production
(() => {
  const isProd = process.env.NODE_ENV === 'production';
  // Derive reasonable defaults to avoid runtime 500s if misconfigured
  if (!process.env.NEXTAUTH_URL) {
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
    const localUrl = 'http://localhost:3000';
    process.env.NEXTAUTH_URL = vercelUrl || localUrl;
  }
  if (!process.env.NEXTAUTH_URL_INTERNAL) {
    process.env.NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL;
  }
  if (!process.env.NEXTAUTH_SECRET) {
    // Fallback secret (avoids 500 error page). Replace with a secure env on production.
    process.env.NEXTAUTH_SECRET = isProd ? 'ms-education-fallback-secret' : 'dev-secret-change-me-in-production';
  }
})();

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
        const isProd = process.env.NODE_ENV === 'production';
        const adminEmail = (
          process.env.ADMIN_EMAIL ||
          (!isProd ? 'admin@mseducation.com' : '')
        ).trim().toLowerCase();
        const adminPassword = (
          process.env.ADMIN_PASSWORD ||
          (!isProd ? 'Hello$@' : '')
        ).trim();
        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password.trim();

        if (inputEmail === adminEmail && inputPassword === adminPassword) {
          return {
            id: '1',
            email: inputEmail,
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
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
