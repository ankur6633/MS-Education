import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  mobile: string;
  otp: string;
  expiry: Date;
  attempts: number;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  mobile: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    maxlength: 10
  },
  otp: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 6
  },
  expiry: { 
    type: Date, 
    required: true 
  },
  attempts: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create index for automatic cleanup of expired OTPs
OTPSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

