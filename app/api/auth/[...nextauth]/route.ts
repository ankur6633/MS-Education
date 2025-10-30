import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// Force a single origin in development BEFORE creating the handler
if (process.env.NODE_ENV !== 'production') {
  const origin = 'http://localhost:3000';
  process.env.NEXTAUTH_URL = origin;
  process.env.NEXTAUTH_URL_INTERNAL = origin;
}

const nextAuthHandler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: any) {
  // @ts-ignore - next-auth handler signature
  return nextAuthHandler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  // @ts-ignore - next-auth handler signature
  return nextAuthHandler(req, ctx);
}
