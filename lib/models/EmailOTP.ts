import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailOTP extends Document {
  email: string;
  otp: string;
  expiry: Date;
  attempts: number;
  createdAt: Date;
}

const EmailOTPSchema = new Schema<IEmailOTP>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 200,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
    maxlength: 6,
  },
  expiry: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EmailOTPSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailOTP || mongoose.model<IEmailOTP>('EmailOTP', EmailOTPSchema);


