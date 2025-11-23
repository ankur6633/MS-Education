import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import TicketReply from '@/lib/models/TicketReply';

// Helper to extract email from header
async function getRequestEmail(request: NextRequest): Promise<string | null> {
  const headerEmail = request.headers.get('x-user-email');
  if (headerEmail) return headerEmail;
  
  const { searchParams } = new URL(request.url);
  const queryEmail = searchParams.get('email');
  if (queryEmail) return queryEmail;
  
  return null;
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { userId: user._id };
    if (status) {
      query.status = status;
    }

    // Fetch tickets
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get reply counts for each ticket
    const ticketIds = tickets.map(t => t._id);
    const replyCounts = await TicketReply.aggregate([
      { $match: { ticketId: { $in: ticketIds } } },
      { $group: { _id: '$ticketId', count: { $sum: 1 } } }
    ]);
    
    const replyCountMap = new Map(replyCounts.map(r => [r._id.toString(), r.count]));

    const ticketsWithReplies = tickets.map(ticket => ({
      ...ticket,
      replyCount: replyCountMap.get(ticket._id.toString()) || 0
    }));

    const total = await Ticket.countDocuments(query);

    return NextResponse.json({
      success: true,
      tickets: ticketsWithReplies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

