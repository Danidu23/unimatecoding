const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const GlobalRules = require('../models/GlobalRules');
const FacilityService = require('../models/FacilityService');

// Helper to get global rules falling back to defaults
const getGlobalRules = async () => {
    let rules = await GlobalRules.findOne();
    if (!rules) {
        rules = await GlobalRules.create({});
    }
    return rules;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Student
const createBooking = async (req, res) => {
    try {
        const { slotId, date, participants } = req.body;
        const userId = req.user._id;

        const slot = await Slot.findById(slotId).populate('facilityServiceId');
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        
        const facility = slot.facilityServiceId;

        // 1. Date validation (future or today)
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestedDate < today) {
            return res.status(400).json({ message: 'Cannot book for a past date' });
        }

        // 2. Slot availability check
        if (slot.status !== 'available') {
            return res.status(400).json({ message: `Slot is not available (${slot.status})` });
        }

        // 3. Double booking prevention
        const existingBooking = await Booking.findOne({
            userId,
            slotId,
            status: { $in: ['pending', 'approved'] }
        });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this slot' });
        }

        // 4. Capacity limit
        if (slot.booked + participants > slot.capacity) {
            return res.status(400).json({ message: `Only ${slot.capacity - slot.booked} spots left in this slot` });
        }

        // 5. Daily limit check
        const rules = await getGlobalRules();
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const dailyBookingsCount = await Booking.countDocuments({
            userId,
            date: date,
            status: { $in: ['pending', 'approved'] }
        });

        if (dailyBookingsCount >= rules.maxBookingsPerDay) {
            return res.status(400).json({ message: `Daily booking limit (${rules.maxBookingsPerDay}) reached` });
        }

        // Determine cancellation deadline
        const slotDateTime = new Date(`${date}T${slot.startTime}:00`);
        const cancelHours = facility.type === 'service' ? rules.serviceCancelHoursBefore : rules.sportsCancelHoursBefore;
        const cancelDeadline = new Date(slotDateTime.getTime() - cancelHours * 60 * 60 * 1000);

        // Create booking
        const booking = new Booking({
            userId,
            slotId,
            facilityServiceId: facility._id,
            date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            participants,
            status: 'pending',
            cancelDeadline
        });

        // We DO NOT update slot.booked until it is approved. Wait, the system requirements say: 
        // "Approve action: Status -> Approved, Slot becomes reserved/locked depending on facility rules".
        // Let's update slot booked count on approval, but to prevent overbooking of pending requests,
        // we could update it immediately and revert if rejected. Or keep pending and race condition on approval.
        // Let's update `booked` here to reserve the spot immediately, so others can't book it while pending.
        slot.booked += participants;
        if (slot.booked >= slot.capacity) {
            slot.status = 'full';
        }
        await slot.save();

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Student
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('facilityServiceId', 'name image type category')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Student
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'pending' && booking.status !== 'approved') {
            return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
        }

        if (new Date() > booking.cancelDeadline) {
            return res.status(400).json({ message: 'Cancellation deadline has passed' });
        }

        booking.status = 'cancelled';
        booking.cancelReason = req.body?.reason || 'Cancelled by user';
        
        // Release slot capacity
        const slot = await Slot.findById(booking.slotId);
        if (slot) {
            slot.booked -= booking.participants;
            if (slot.status === 'full') slot.status = 'available';
            await slot.save();
        }

        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all booking requests (Admin)
// @route   GET /api/bookings
// @access  Admin/Staff
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('facilityServiceId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (Approve/Reject)
// @route   PUT /api/bookings/:id/status
// @access  Admin/Staff
const updateBookingStatus = async (req, res) => {
    try {
        const { status, rejectReason } = req.body; // status: 'approved' | 'rejected'
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Can only update pending bookings' });
        }

        if (status === 'rejected') {
            if (!rejectReason) return res.status(400).json({ message: 'Rejection reason required' });
            booking.status = 'rejected';
            booking.rejectReason = rejectReason;

            // Free slot
            const slot = await Slot.findById(booking.slotId);
            if (slot) {
                slot.booked -= booking.participants;
                if (slot.status === 'full') slot.status = 'available';
                await slot.save();
            }
        } else if (status === 'approved') {
            // Check conflict for single-book slots
            const slot = await Slot.findById(booking.slotId);
            if (slot && slot.capacity === 1) {
                const otherApproved = await Booking.find({ slotId: slot._id, status: 'approved' });
                if (otherApproved.length > 0) {
                    return res.status(400).json({ message: 'Slot conflict: another booking is already approved' });
                }
            }
            booking.status = 'approved';
        } else {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const updatedBooking = await booking.save();
        res.json(updatedBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
};
