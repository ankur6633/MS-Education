import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo {
  title: string;
  url: string;
  duration: number; // in seconds
  order: number;
}

export interface IPDF {
  title: string;
  url: string;
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  isPaid: boolean;
  videos: IVideo[];
  pdfs: IPDF[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number, required: true },
  order: { type: Number, required: true, default: 0 }
});

const PDFSchema = new Schema<IPDF>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, required: true, default: 0 }
});

const CourseSchema = new Schema<ICourse>({
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
  thumbnail: { 
    type: String, 
    required: true 
  },
  isPaid: { 
    type: Boolean, 
    required: true,
    default: false
  },
  videos: [VideoSchema],
  pdfs: [PDFSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
CourseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
