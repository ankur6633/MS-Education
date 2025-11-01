import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

if (process.env.NODE_ENV !== 'production') {
  const origin = 'http://localhost:3000';
  process.env.NEXTAUTH_URL = origin;
  process.env.NEXTAUTH_URL_INTERNAL = origin;
  process.env.AUTH_TRUST_HOST = 'true';

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'dev-secret-change-me';
  }

  if (process.env.NEXTAUTH_DEBUG ?? process.env.NODE_ENV === 'development') {
    console.info('[auth] Using NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // For demo purposes, using hardcoded admin credentials
        // In production, you should store these in a database
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (credentials.username === adminUsername && credentials.password === adminPassword) {
          return {
            id: '1',
            username: credentials.username,
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
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token) return session;
      // Ensure session.user exists before assigning custom fields
      const user = (session.user || {}) as any;
      user.id = token.sub || '';
      if (token.role) user.role = token.role;
      if (token.username) user.username = token.username;
      (session as any).user = user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        // Allow relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        const to = new URL(url);
        const base = new URL(baseUrl);
        // Allow same-origin URLs
        if (to.origin === base.origin) return url;
      } catch {}
      // Fallback to base URL to avoid malformed concatenation
      return baseUrl;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // @ts-expect-error Option exists at runtime but is missing from the current type definitions
  trustHost: process.env.NODE_ENV !== 'production',
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
