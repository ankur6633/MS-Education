import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import TicketReply from '@/lib/models/TicketReply';
import { z } from 'zod';

// Helper to extract email from header
async function getRequestEmail(request: NextRequest): Promise<string | null> {
  const headerEmail = request.headers.get('x-user-email');
  if (headerEmail) return headerEmail;
  
  const { searchParams } = new URL(request.url);
  const queryEmail = searchParams.get('email');
  if (queryEmail) return queryEmail;
  
  return null;
}

const replySchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const email = await getRequestEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Get user ID from email
    const User = (await import('@/lib/models/User')).default;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = replySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    // Verify ticket exists and belongs to user
    const ticket = await Ticket.findOne({
      _id: parsed.data.ticketId,
      userId: user._id
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Create reply
    const reply = await TicketReply.create({
      ticketId: parsed.data.ticketId,
      userId: user._id,
      message: parsed.data.message,
      isAdmin: false
    });

    // Update ticket status if it was closed/resolved
    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      ticket.status = 'open';
      await ticket.save();
    }

    return NextResponse.json({
      success: true,
      reply: {
        _id: reply._id,
        message: reply.message,
        createdAt: reply.createdAt
      },
      message: 'Reply added successfully'
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

