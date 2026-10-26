import mongoose from 'mongoose';

// Cache the connection across hot reloads in dev and across invocations in SSR.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.__mongoose ?? { conn: null, promise: null };
globalThis.__mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    throw new Error(
      'MONGODB_URI is not set. Add your MongoDB Atlas connection string to .env'
    );
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45_000,
      family: 4
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

// Expose a safe status probe for health checks (never throws)
export function dbStatus(): 'disconnected' | 'connected' | 'connecting' | 'disconnecting' {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}
