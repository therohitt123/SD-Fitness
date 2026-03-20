import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try {
    if (!ENV.MONGO_URI) {
      console.warn('MONGO_URI is not set. Backend will not connect to database.');
      return;
    }
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error?.message?.includes('ENOTFOUND')) {
      console.error(
        'DNS lookup failed for Atlas host. Verify MONGO_URI, internet/VPN, and DNS settings (8.8.8.8 / 1.1.1.1).'
      );
    }
    process.exit(1);
  }
};
