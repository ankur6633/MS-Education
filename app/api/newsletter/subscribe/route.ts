import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { emailService } from '@/lib/email-service';
import { z } from 'zod';

// Validation schema
const subscribeSchema = z.object({
  email: z
    .string()
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email cannot exceed 254 characters') // RFC 5321 standard
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  source: z.string().optional().default('footer-newsletter')
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = subscribeSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      );
    }

    const { email, source } = validationResult.data;

    // Get IP address for tracking (optional)
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Connect to database
    await dbConnect();

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This email is already subscribed to our newsletter!' 
          },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscriber
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.source = source;
        existingSubscriber.ipAddress = ipAddress;
        await existingSubscriber.save();

        // Send welcome email
        const emailSent = await emailService.sendWelcomeEmail(email);

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          emailSent
        });
      }
    }

    // Create new subscriber
    const newSubscriber = await Subscriber.create({
      email,
      source,
      ipAddress,
      subscribedAt: new Date(),
      isActive: true
    });

    // Send welcome email
    let emailSent = false;
    try {
      emailSent = await emailService.sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Check your email for a welcome message.',
        emailSent,
        subscriber: {
          email: newSubscriber.email,
          subscribedAt: newSubscriber.subscribedAt
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate email error (in case of race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This email is already subscribed!' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to subscribe. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status (optional)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    return NextResponse.json({
      success: true,
      subscribed: !!subscriber && subscriber.isActive,
      subscribedAt: subscriber?.subscribedAt || null
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

