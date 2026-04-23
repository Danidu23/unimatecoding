const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsBooking', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SportsFacilityService', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.models.SportsFeedback || mongoose.model('SportsFeedback', feedbackSchema);
