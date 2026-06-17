const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const users = await User.find({}, 'name email role').select('+password');
    console.log('Users in DB (with passwords):', users);
    
    for (const user of users) {
      const isMatch = await user.matchPassword('password123');
      console.log(`Password match for ${user.email}: ${isMatch}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkDB();
