import mongoose from 'mongoose';

const ENV_URI = process.env.MONGODB_URI;
// Provide a sane local fallback for development if env is missing
const FALLBACK_LOCAL_URI = 'mongodb://127.0.0.1:27017/ms-education';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function resolveMongoUri(): string {
  // Prefer configured env
  if (ENV_URI && ENV_URI !== 'your_mongodb_connection_string') {
    return ENV_URI;
  }
  // Fall back to local for development
  console.warn('⚠️ MONGODB_URI not configured. Falling back to local MongoDB at', FALLBACK_LOCAL_URI);
  return FALLBACK_LOCAL_URI;
}

async function dbConnect() {
  const MONGODB_URI = resolveMongoUri();

  // Validate URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    const error = new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
    console.error('❌ Invalid MongoDB URI:', error.message);
    throw error;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB:', mongoose.connection.host);
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
