const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityService', required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    startTime: { type: String, required: true }, // 'HH:mm'
    endTime: { type: String, required: true }, // 'HH:mm'
    capacity: { type: Number, required: true },
    booked: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'full', 'blocked'], default: 'available' },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
