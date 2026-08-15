import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      mongoose.connection.on('connected', () => {
        console.log("✅ Database Connected Successfully");
      });

      mongoose.connection.on('error', (err) => {
        console.error("❌ Mongoose Connection Error:", err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn("⚠️ Mongoose Disconnected");
      });
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/ieupdated`, {
      maxPoolSize: 50, // Keep up to 50 connections alive for parallel throughput
      minPoolSize: 10, // Maintain baseline pool for zero cold-start latency
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectDB;
