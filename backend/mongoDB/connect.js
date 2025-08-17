import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  try {
    console.log("connecting...");
    console.log("URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "test" });
    console.log("MongoDB connected for biojourney");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
}
