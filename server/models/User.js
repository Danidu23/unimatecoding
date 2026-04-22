const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    match: [/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'],
    trim: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true, // admins may not have a studentId
    match: [/^IT\d{7}$/, 'Invalid Student ID format (e.g., IT2324616)'],
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  preferences: {
    skills: [String],
    activities: [String],
    commitment: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
