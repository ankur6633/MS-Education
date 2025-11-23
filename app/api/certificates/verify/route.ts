import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');

    if (!hash) {
      return NextResponse.json({ error: 'Verification hash is required' }, { status: 400 });
    }

    const certificate = await Certificate.findOne({ verificationHash: hash })
      .populate('userId', 'name email')
      .populate('courseId', 'title description')
      .lean() as any;

    if (!certificate) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: 'Certificate not found or invalid'
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      certificate: {
        certificateUrl: certificate.certificateUrl,
        completedAt: certificate.completedAt,
        user: {
          name: certificate.userId?.name || '',
          email: certificate.userId?.email || ''
        },
        course: {
          title: certificate.courseId?.title || '',
          description: certificate.courseId?.description || ''
        }
      }
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

