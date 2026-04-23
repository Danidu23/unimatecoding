const SportsSlot = require('../models/SportsSlot');
const SportsBooking = require('../models/SportsBooking');
const SportsFacilityService = require('../models/SportsFacilityService');

// Helper function to generate slots for a facility on a specific date
const generateSlotsHelper = async (facilityServiceId, date) => {
    const facility = await SportsFacilityService.findById(facilityServiceId);
    if (!facility) {
        throw new Error('Facility not found');
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
        const exists = await SportsSlot.findOne({ facilityServiceId, date, startTime });
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
        return await SportsSlot.insertMany(generatedSlots);
    }
    return [];
};

// @desc    Get available slots (automatically generates if none exist)
// @route   GET /api/slots
// @access  Public / Student
const getSlots = async (req, res) => {
    try {
        const { date, facilityServiceId } = req.query;
        if (!facilityServiceId || !date) {
            return res.status(400).json({ message: 'facilityServiceId and date are required' });
        }

        let slots = await SportsSlot.find({ facilityServiceId, date }).sort({ startTime: 1 });
        
        // If no slots exist for this date, auto-generate them
        if (slots.length === 0) {
            await generateSlotsHelper(facilityServiceId, date);
            // Fetch again after generation
            slots = await SportsSlot.find({ facilityServiceId, date }).sort({ startTime: 1 });
        }

        // Calculate occupancy for each slot
        const resultSlots = slots.map(slot => {
            const occupancyPercentage = (slot.capacity > 0) ? (slot.booked / slot.capacity) * 100 : 100;
            let occupancyLevel = 'low';
            if (occupancyPercentage >= 80) occupancyLevel = 'full';
            else if (occupancyPercentage >= 40) occupancyLevel = 'medium';

            return {
                ...slot.toObject(),
                occupancyPercentage,
                occupancyLevel
            };
        });

        res.json(resultSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate slots for a facility (Admin/Staff manual trigger)
// @route   POST /api/slots/generate
// @access  Admin/Staff
const generateSlots = async (req, res) => {
    try {
        const { facilityServiceId, date } = req.body;
        const created = await generateSlotsHelper(facilityServiceId, date);
        
        if (created.length > 0) {
            res.status(201).json(created);
        } else {
            // If some exist, return what exists for that date
            const existing = await SportsSlot.find({ facilityServiceId, date }).sort({ startTime: 1 });
            res.status(200).json(existing.length > 0 ? existing : { message: 'No slots to generate' });
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
        const slot = await SportsSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        const { block } = req.body; // true to block, false to unblock

        if (block) {
            // Check for approved bookings
            const approvedBookingsCount = await SportsBooking.countDocuments({ slotId: slot._id, status: 'approved' });
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
