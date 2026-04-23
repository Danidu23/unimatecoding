const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsSlot', required: true },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsFacilityService', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    startTime: { type: String, required: true }, // 'HH:mm'
    endTime: { type: String, required: true }, // 'HH:mm'
    participants: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
    attendanceStatus: { 
        type: String, 
        enum: ['pending', 'checked-in', 'completed', 'no-show'], 
        default: 'pending' 
    },
    qrCode: { type: String },
    checkInTime: { type: Date },
    feedbackSubmitted: { type: Boolean, default: false },
    cancelDeadline: { type: Date, required: true },
    cancelReason: { type: String },
    rejectReason: { type: String },
    isPriority: { type: Boolean, default: false },
    priorityReason: { type: String },
    priorityVerified: { type: Boolean, default: false },
    notificationSent: {
        submitted: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        rejected: { type: Boolean, default: false },
        reminder30min: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.models.SportsBooking || mongoose.model('SportsBooking', bookingSchema);
