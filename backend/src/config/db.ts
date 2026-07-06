import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrimind';
    
    // Set mongoose options
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(connStr);
    console.log(`MongoDB Connected successfully to ${mongoose.connection.name}`);
  } catch (error) {
    console.warn('WARNING: Failed to connect to MongoDB. Endpoints requiring database access might fail, but server will continue running for mock demos.');
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
};
