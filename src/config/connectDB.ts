import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Extend global type to store mongoose connection
type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Use a unique symbol for the global cache to avoid name collisions
const globalForMongoose = globalThis as typeof globalThis & {
  _mongoose?: MongooseConnection;
};

// Initialize cache if not already set
if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (globalForMongoose._mongoose!.conn) {
    return globalForMongoose._mongoose!.conn;
  }

  if (!globalForMongoose._mongoose!.promise) {
    globalForMongoose._mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalForMongoose._mongoose!.conn = await globalForMongoose._mongoose!.promise;
  return globalForMongoose._mongoose!.conn;
}
