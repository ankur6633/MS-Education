import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
    }),
    // Google OAuth Provider (optional - only enabled if both Client ID and Secret are provided)
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_CLIENT_ID.trim() !== '' &&
        process.env.GOOGLE_CLIENT_SECRET.trim() !== ''
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow Google sign-in if Google provider is configured
      if (account?.provider === 'google') {
        // You can add additional checks here if needed
        // For example, restrict to specific email domains
        return true;
      }
      // Allow credentials sign-in
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
      }
      // Handle Google OAuth
      if (account?.provider === 'google') {
        // You can fetch user from database here and set role
        // For now, we'll set a default role or check if it's admin email
        const isProd = process.env.NODE_ENV === 'production';
        const adminEmail = (
          process.env.ADMIN_EMAIL ||
          (!isProd ? 'admin@mseducation.com' : '')
        ).trim().toLowerCase();
        
        if (token.email?.toLowerCase() === adminEmail) {
          token.role = 'admin';
        }
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
