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
  hindiTitle: string;
  description: string;
  thumbnail: string;
  isPaid: boolean;
  currentPrice?: number;
  originalPrice?: number;
  discount?: number;
  duration: string;
  students: string;
  rating: number;
  reviews: number;
  features: string[];
  badge: string;
  badgeColor: string;
  image: string;
  theme: string;
  showInCarousel: boolean;
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
  hindiTitle: {
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
  currentPrice: {
    type: Number,
    required: false
  },
  originalPrice: {
    type: Number,
    required: false
  },
  discount: {
    type: Number,
    required: false
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  students: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  badge: {
    type: String,
    required: true,
    trim: true
  },
  badgeColor: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    type: String,
    required: true,
    trim: true
  },
  showInCarousel: {
    type: Boolean,
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
