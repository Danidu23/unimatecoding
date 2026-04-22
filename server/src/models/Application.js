const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    match: [/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'],
  },
  studentIdNumber: {
    type: String,
    required: [true, 'Student ID is required'],
    match: [/^IT\d{7}$/, 'Invalid Student ID format'],
    uppercase: true,
  },
  preferredRole: {
    type: String,
    required: [true, 'Preferred role is required'],
    enum: ['Member', 'Organizer', 'Leader', 'Treasurer', 'Secretary'],
  },
  reason: {
    type: String,
    required: [true, 'Reason for joining is required'],
    minlength: [20, 'Reason must be at least 20 characters'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Interview', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  interviewAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

// Prevent duplicate applications from the same student to the same club
applicationSchema.index({ studentId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
