import mongoose, { Schema, model, models } from 'mongoose';

export interface ISubscriber {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string;
  ipAddress?: string;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],
      maxlength: [254, 'Email cannot exceed 254 characters'] // RFC 5321 standard
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      default: 'footer-newsletter',
      enum: ['footer-newsletter', 'course-page', 'popup', 'other']
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ subscribedAt: -1 });

// Virtual for days since subscription
SubscriberSchema.virtual('daysSinceSubscription').get(function() {
  return Math.floor((Date.now() - this.subscribedAt.getTime()) / (1000 * 60 * 60 * 24));
});

const Subscriber = models.Subscriber || model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;

