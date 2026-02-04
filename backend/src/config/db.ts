import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
  try {
    logger.info('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('✅ MongoDB connected successfully');
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`💥 MongoDB connection error: ${err.message}`);
    } else {
      logger.error('💥 MongoDB connection error: Unknown error');
    }
    process.exit(1);
  }
};

export default connectDB;