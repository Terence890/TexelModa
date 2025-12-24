import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/texelmoda';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // These options are recommended for Mongoose 6+
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log(`MongoDB Connected: ${mongoose.connection.host}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;

