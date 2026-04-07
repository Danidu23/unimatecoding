const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: [
            'booking_submitted',
            'booking_approved', 
            'booking_rejected',
            'booking_cancelled',
            'reminder_30min',
            'reminder_1day',
            'priority_request',
            'waitlist_available',
            'schedule_changed',
            'slot_cancelled'
        ]
    },
    isRead: { type: Boolean, default: false },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    facilityServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityService' },
    relatedData: { type: mongoose.Schema.Types.Mixed }, // Store additional context data
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
