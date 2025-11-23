import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/Certificate';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import crypto from 'crypto';

// Helper to extract email from header
async function getRequestEmail(request: NextRequest): Promise<string | null> {
  const headerEmail = request.headers.get('x-user-email');
  if (headerEmail) return headerEmail;
  
  const { searchParams } = new URL(request.url);
  const queryEmail = searchParams.get('email');
  if (queryEmail) return queryEmail;
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Get user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      userId: user._id,
      courseId: courseId
    });

    if (existingCertificate) {
      return NextResponse.json({
        success: true,
        certificate: existingCertificate,
        message: 'Certificate already exists'
      });
    }

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Generate verification hash
    const hashData = `${user._id}-${courseId}-${Date.now()}`;
    const verificationHash = crypto.createHash('sha256').update(hashData).digest('hex').substring(0, 16);

    // For now, we'll create a placeholder certificate URL
    // In production, you would generate an actual certificate PDF/image
    const certificateUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Certificate+of+Completion%0A%0A${encodeURIComponent(user.name)}%0A%0AHas+successfully+completed%0A%0A${encodeURIComponent(course.title)}%0A%0A${new Date().toLocaleDateString()}`;

    // Create certificate
    const certificate = await Certificate.create({
      userId: user._id,
      courseId: courseId,
      certificateUrl,
      verificationHash,
      completedAt: new Date()
    });

    // Create update entry for certificate
    try {
      const Update = (await import('@/lib/models/Update')).default;
      await Update.create({
        title: `Certificate Unlocked: ${course.title}`,
        description: `Congratulations! You've completed "${course.title}" and earned a certificate.`,
        type: 'certificate_unlocked',
        createdBy: user._id,
        courseId: course._id,
        image: course.thumbnail,
        redirectUrl: `/dashboard/accomplishments`
      });
    } catch (updateError) {
      console.error('Error creating update entry:', updateError);
      // Don't fail certificate generation if update creation fails
    }

    return NextResponse.json({
      success: true,
      certificate: {
        _id: certificate._id,
        certificateUrl: certificate.certificateUrl,
        verificationHash: certificate.verificationHash,
        completedAt: certificate.completedAt
      },
      message: 'Certificate generated successfully'
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

