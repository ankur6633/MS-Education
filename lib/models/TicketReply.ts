import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketReply extends Document {
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  isAdmin: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketReplySchema = new Schema<ITicketReply>({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  attachments: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
TicketReplySchema.index({ ticketId: 1, createdAt: 1 });
TicketReplySchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt field before saving
TicketReplySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.TicketReply || mongoose.model<ITicketReply>('TicketReply', TicketReplySchema);

