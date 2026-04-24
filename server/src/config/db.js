const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // Set explicit DNS servers to resolve MongoDB Atlas SRV records
  // This fixes the 'querySrv ECONNREFUSED' error in environments with DNS issues.
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsError) {
    console.warn('DNS server setting failed, continuing with system defaults:', dnsError.message);
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Connection URI (masked):', process.env.MONGO_URI.replace(/\/\/.*@/, '//****:****@'));
    process.exit(1);
  }
};

module.exports = connectDB;