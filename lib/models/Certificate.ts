import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateUrl: string;
  verificationHash: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateUrl: {
    type: String,
    required: true,
    trim: true
  },
  verificationHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  completedAt: {
    type: Date,
    required: true,
    default: Date.now
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
CertificateSchema.index({ userId: 1, completedAt: -1 });
CertificateSchema.index({ verificationHash: 1 });
CertificateSchema.index({ courseId: 1 });

// Compound index to ensure one certificate per user-course pair
CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Update the updatedAt field before saving
CertificateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

