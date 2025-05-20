import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in environment variables");
}

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function mongooseConnect() {
  if (cached.conn) {
    return cached.conn; // ✅ Use existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {}) // ❌ Removed outdated options
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

