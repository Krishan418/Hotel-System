// ============================================
// config/db.js — MongoDB Connection
// ============================================
// This file connects our server to MongoDB.
// We use Mongoose, which is a library that makes
// working with MongoDB easier in Node.js.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise
    // We use the MONGO_URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the server
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
