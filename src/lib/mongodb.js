import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.log("An error occured while trying to connect to MongoDB.", error);
  }
};
