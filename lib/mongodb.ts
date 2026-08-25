import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const cached = (global as unknown as { mongoose?: MongooseCache }).mongoose ?? { conn: null, promise: null };
(global as unknown as { mongoose: MongooseCache }).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "test",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
