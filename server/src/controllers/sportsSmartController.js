const SportsSlot = require('../models/SportsSlot');
const SportsBooking = require('../models/SportsBooking');

// Helper: Calculate occupancy level and percentage
const calculateOccupancy = (booked, capacity) => {
    if (capacity <= 0) return { percentage: 100, level: 'full' };
    const percentage = (booked / capacity) * 100;
    let level = 'low'; // 0-39%
    if (percentage >= 80) level = 'full'; // 80-100%
    else if (percentage >= 40) level = 'medium'; // 40-79%
    return { percentage: Math.round(percentage), level };
};

// Helper: Check if time slots conflict
const isConflict = (slot, userBookings) => {
    return userBookings.some(b => {
        const slotStart = new Date(`1970-01-01T${slot.startTime}:00`);
        const slotEnd = new Date(`1970-01-01T${slot.endTime}:00`);
        const bStart = new Date(`1970-01-01T${b.startTime}:00`);
        const bEnd = new Date(`1970-01-01T${b.endTime}:00`);
        return (slotStart < bEnd && slotEnd > bStart);
    });
};

// @desc    Get smart suggestion for a facility on a specific date
// @route   GET /api/smart/suggestions
// @access  Private
const getSmartSuggestions = async (req, res) => {
    try {
        const { facilityServiceId, date } = req.query;

        if (!facilityServiceId || !date) {
            return res.status(400).json({ message: 'facilityServiceId and date are required' });
        }

        // 1. Get all available slots for that facility on the given date
        const slots = await SportsSlot.find({ facilityServiceId, date, status: { $ne: 'blocked' } });

        if (!slots || slots.length === 0) {
            return res.status(200).json({ 
                suggestions: [],
                message: 'No slots available on this date'
            });
        }

        // 2. Get user's existing bookings for the day to find conflicts
        const userBookings = await SportsBooking.find({
            userId: req.user._id, 
            date, 
            status: { $in: ['pending', 'approved'] } 
        });

        // 3. Calculate occupancy and check for conflicts
        let availableSlots = slots.map(slot => {
            const occupancy = calculateOccupancy(slot.booked, slot.capacity);
            const hasConflict = isConflict(slot, userBookings);
            const isFull = occupancy.level === 'full';
            const isBookable = slot.status === 'available' && !hasConflict && !isFull;

            return {
                ...slot.toObject(),
                occupancyPercentage: occupancy.percentage,
                occupancyLevel: occupancy.level,
                hasConflict,
                isFull,
                isBookable,
                availableSpots: Math.max(0, slot.capacity - slot.booked)
            };
        });

        // 4. Sort by priority: bookable first (lowest occupancy), then others
        availableSlots.sort((a, b) => {
            if (a.isBookable !== b.isBookable) return a.isBookable ? -1 : 1;
            return a.occupancyPercentage - b.occupancyPercentage;
        });

        // 5. Return top 5 suggestions with full details
        const suggestions = availableSlots.slice(0, 5).map(slot => ({
            _id: slot._id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            occupancyLevel: slot.occupancyLevel,
            occupancyPercentage: slot.occupancyPercentage,
            availableSpots: slot.availableSpots,
            hasConflict: slot.hasConflict,
            isFull: slot.isFull,
            isBookable: slot.isBookable,
            recommendation: !slot.isBookable ? 
                          (slot.hasConflict ? '⚠️ Conflict' : slot.isFull ? '🔴 Full' : 'Available') :
                          (slot.occupancyPercentage < 40 ? '✓ Less crowded' : 
                           slot.occupancyPercentage < 70 ? 'Moderate' : 'Getting Full')
        }));

        res.status(200).json({ suggestions });

    } catch (error) {
        res.status(500).json({ message: 'Error getting smart suggestions', error: error.message });
    }
};

// @desc    Get all slots with occupancy for a facility and date
// @route   GET /api/smart/occupancy
// @access  Private
const getOccupancyInfo = async (req, res) => {
    try {
        const { facilityServiceId, date } = req.query;

        if (!facilityServiceId || !date) {
            return res.status(400).json({ message: 'facilityServiceId and date are required' });
        }

        const slots = await SportsSlot.find({ facilityServiceId, date });

        const slotsWithOccupancy = slots.map(slot => {
            const occupancy = calculateOccupancy(slot.booked, slot.capacity);
            return {
                _id: slot._id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                capacity: slot.capacity,
                booked: slot.booked,
                occupancyLevel: occupancy.level,
                occupancyPercentage: occupancy.percentage,
                statusIcon: occupancy.level === 'low' ? '🟢' : 
                           occupancy.level === 'medium' ? '🟡' : '🔴',
                isAvailable: slot.status === 'available',
                isFull: occupancy.level === 'full'
            };
        });

        res.status(200).json({ slots: slotsWithOccupancy });

    } catch (error) {
        res.status(500).json({ message: 'Error getting occupancy info', error: error.message });
    }
};

// @desc    Get priority booking statistics for admin
// @route   GET /api/smart/priority-stats
// @access  Private (Admin/Staff only)
const getPriorityStats = async (req, res) => {
    try {
        const priorityBookings = await SportsBooking.find({ isPriority: true })
            .populate('userId', 'name email')
            .populate('facilityServiceId', 'name')
            .sort({ createdAt: -1 });

        const stats = {
            totalPriority: priorityBookings.length,
            byStatus: {
                pending: priorityBookings.filter(b => b.status === 'pending').length,
                approved: priorityBookings.filter(b => b.status === 'approved').length,
                rejected: priorityBookings.filter(b => b.status === 'rejected').length
            },
            unverified: priorityBookings.filter(b => !b.priorityVerified).length,
            bookings: priorityBookings.slice(0, 20)
        };

        res.status(200).json(stats);

    } catch (error) {
        res.status(500).json({ message: 'Error getting priority stats', error: error.message });
    }
};

// @desc    Check for conflicts with user's existing bookings
// @route   POST /api/smart/check-conflicts
// @access  Private
const checkConflicts = async (req, res) => {
    try {
        const { slotId, date } = req.body;
        const userId = req.user._id;

        const slot = await SportsSlot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        // Get user's bookings for the same day
        const userBookings = await SportsBooking.find({
            userId,
            date,
            status: { $in: ['pending', 'approved'] }
        }).populate('facilityServiceId', 'name');

        const conflicts = userBookings.filter(b => {
            const slotStart = new Date(`1970-01-01T${slot.startTime}:00`);
            const slotEnd = new Date(`1970-01-01T${slot.endTime}:00`);
            const bStart = new Date(`1970-01-01T${b.startTime}:00`);
            const bEnd = new Date(`1970-01-01T${b.endTime}:00`);
            return (slotStart < bEnd && slotEnd > bStart);
        });

        res.status(200).json({
            hasConflict: conflicts.length > 0,
            conflicts: conflicts.map(c => ({
                id: c._id,
                facility: c.facilityServiceId.name,
                time: `${c.startTime} - ${c.endTime}`,
                status: c.status
            }))
        });

    } catch (error) {
        res.status(500).json({ message: 'Error checking conflicts', error: error.message });
    }
};

module.exports = {
    getSmartSuggestions,
    getOccupancyInfo,
    getPriorityStats,
    checkConflicts
};
