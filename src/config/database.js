import mongoose from "mongoose";

// Connecting to database
const connectDB = async () => {
  const MONGODB_URL = process.env.MONGODB_URL;
  return await mongoose.connect(MONGODB_URL);
};

export default connectDB;
