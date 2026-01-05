// test.js
import 'dotenv/config'; // ✅ This loads your .env.local automatically
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✅ MongoDB connected successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
