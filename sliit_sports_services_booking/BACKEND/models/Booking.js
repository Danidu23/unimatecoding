const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityService', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    startTime: { type: String, required: true }, // 'HH:mm'
    endTime: { type: String, required: true }, // 'HH:mm'
    participants: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
    cancelDeadline: { type: Date, required: true },
    cancelReason: { type: String },
    rejectReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
