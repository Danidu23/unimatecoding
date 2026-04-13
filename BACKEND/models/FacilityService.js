const mongoose = require('mongoose');

const facilityServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['sport', 'service'], required: true },
    category: { type: String, required: true },
    capacity: { type: Number, default: 1 },
    operatingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true }
    },
    slotDurationMinutes: { type: Number, required: true },
    active: { type: Boolean, default: true },
    image: { type: String },
    tags: [{ type: String }],
    provider: { type: String } // e.g., 'Dr. Smith', optional
}, { timestamps: true });

module.exports = mongoose.model('FacilityService', facilityServiceSchema);
