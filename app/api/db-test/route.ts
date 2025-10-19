import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      status: 'success',
      message: 'Database connected successfully!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
