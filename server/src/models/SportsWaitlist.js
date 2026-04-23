const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsSlot', required: true },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsFacilityService', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    position: { type: Number, required: true }, // Queue position
    participants: { type: Number, default: 1 },
    status: { type: String, enum: ['waiting', 'notified', 'booked', 'expired'], default: 'waiting' },
    slotAvailableNotificationSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.SportsWaitlist || mongoose.model('SportsWaitlist', waitlistSchema);
