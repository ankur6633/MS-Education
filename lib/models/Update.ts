import mongoose, { Document, Schema } from 'mongoose';

export type UpdateType = 'course_added' | 'course_updated' | 'lesson_added' | 'certificate_unlocked' | 'announcement';

export interface IUpdate extends Document {
  title: string;
  description: string;
  type: UpdateType;
  createdBy: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  image?: string;
  redirectUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UpdateSchema = new Schema<IUpdate>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['course_added', 'course_updated', 'lesson_added', 'certificate_unlocked', 'announcement'],
    default: 'announcement'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  redirectUrl: {
    type: String,
    required: false,
    trim: true
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

// Index for faster queries
UpdateSchema.index({ createdAt: -1 });
UpdateSchema.index({ type: 1, createdAt: -1 });

// Update the updatedAt field before saving
UpdateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Update || mongoose.model<IUpdate>('Update', UpdateSchema);

