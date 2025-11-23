import mongoose, { Document, Schema } from 'mongoose';

export interface IUpdateRead extends Document {
  userId: mongoose.Types.ObjectId;
  updateId: mongoose.Types.ObjectId;
  readAt: Date;
  createdAt: Date;
}

const UpdateReadSchema = new Schema<IUpdateRead>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updateId: {
    type: Schema.Types.ObjectId,
    ref: 'Update',
    required: true
  },
  readAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one read record per user-update pair
UpdateReadSchema.index({ userId: 1, updateId: 1 }, { unique: true });
UpdateReadSchema.index({ userId: 1, readAt: -1 });

export default mongoose.models.UpdateRead || mongoose.model<IUpdateRead>('UpdateRead', UpdateReadSchema);

