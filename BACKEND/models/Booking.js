const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityService', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    startTime: { type: String, required: true }, // 'HH:mm'
    endTime: { type: String, required: true }, // 'HH:mm'
    participants: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'checked-in', 'completed', 'cancelled', 'no-show'], default: 'pending' },
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
    },
    // QR Code Check-in
    qrCodeToken: { type: String, required: true },
    checkInTime: { type: Date },
    // Rating & Feedback
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    feedbackSubmittedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
