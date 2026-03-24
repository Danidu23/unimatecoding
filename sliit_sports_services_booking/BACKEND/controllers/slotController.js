const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const FacilityService = require('../models/FacilityService');

// @desc    Get available slots
// @route   GET /api/slots
// @access  Public / Student
const getSlots = async (req, res) => {
    try {
        const { date, facilityServiceId } = req.query;
        let query = {};
        
        if (date) query.date = date;
        if (facilityServiceId) query.facilityServiceId = facilityServiceId;

        const slots = await Slot.find(query).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate slots for a facility
// @route   POST /api/slots/generate
// @access  Admin/Staff
const generateSlots = async (req, res) => {
    try {
        const { facilityServiceId, date } = req.body;
        
        const facility = await FacilityService.findById(facilityServiceId);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }

        const openTime = facility.operatingHours.open; // e.g., "08:00"
        const closeTime = facility.operatingHours.close; // e.g., "20:00"
        const duration = facility.slotDurationMinutes; // e.g., 60

        let openHour = parseInt(openTime.split(':')[0]);
        let openMin = parseInt(openTime.split(':')[1]);
        const closeHour = parseInt(closeTime.split(':')[0]);
        const closeMin = parseInt(closeTime.split(':')[1]);

        let currentTotalMins = openHour * 60 + openMin;
        const closeTotalMins = closeHour * 60 + closeMin;

        const generatedSlots = [];

        while (currentTotalMins + duration <= closeTotalMins) {
            const sh = Math.floor(currentTotalMins / 60).toString().padStart(2, '0');
            const sm = (currentTotalMins % 60).toString().padStart(2, '0');
            const startTime = `${sh}:${sm}`;
            
            currentTotalMins += duration;
            
            const eh = Math.floor(currentTotalMins / 60).toString().padStart(2, '0');
            const em = (currentTotalMins % 60).toString().padStart(2, '0');
            const endTime = `${eh}:${em}`;

            // Check if slot already exists
            const exists = await Slot.findOne({ facilityServiceId, date, startTime });
            if (!exists) {
                generatedSlots.push({
                    facilityServiceId,
                    date,
                    startTime,
                    endTime,
                    capacity: facility.capacity,
                    status: 'available'
                });
            }
        }

        if (generatedSlots.length > 0) {
            const created = await Slot.insertMany(generatedSlots);
            res.status(201).json(created);
        } else {
            res.status(200).json({ message: 'Slots already exist or no slots to generate' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Block/Unblock slot
// @route   PUT /api/slots/:id/block
// @access  Admin/Staff
const toggleBlockSlot = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        const { block } = req.body; // true to block, false to unblock

        if (block) {
            // Check for approved bookings
            const approvedBookingsCount = await Booking.countDocuments({ slotId: slot._id, status: 'approved' });
            if (approvedBookingsCount > 0) {
                return res.status(400).json({ message: 'Cannot block a slot that has approved bookings. Cancel them first.' });
            }
            slot.status = 'blocked';
        } else {
            // Unblock -> change back to available or full based on capacity
            if (slot.booked >= slot.capacity) {
                slot.status = 'full';
            } else {
                slot.status = 'available';
            }
        }

        const updatedSlot = await slot.save();
        res.json(updatedSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSlots,
    generateSlots,
    toggleBlockSlot
};
