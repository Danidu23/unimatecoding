const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // Set explicit DNS servers to resolve MongoDB Atlas SRV records
  // This fixes the 'querySrv ECONNREFUSED' error in environments with DNS issues.
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;