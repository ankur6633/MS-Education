import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  enrolledCourses: string[]; // Array of course IDs
  // Profile fields
  profileImage?: string;
  address?: string;
  interestField?: string;
  interests?: string[];
  bio?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  mobile: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    maxlength: 10
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  enrolledCourses: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
    default: []
  },
  // Optional profile fields
  profileImage: {
    type: String,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: 300
  },
  interestField: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  interests: {
    type: [String],
    required: false,
    default: []
  },
  bio: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500
  },
  skills: {
    type: [String],
    required: false,
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

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
