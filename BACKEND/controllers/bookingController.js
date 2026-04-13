const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const GlobalRules = require('../models/GlobalRules');
const FacilityService = require('../models/FacilityService');
const Notification = require('../models/Notification');
const User = require('../models/User');
const crypto = require('crypto');

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
        const { slotId, date, participants, isPriority, priorityReason } = req.body;
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

        // Generate QR code token
        const qrCodeToken = crypto.randomBytes(16).toString('hex');

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
            cancelDeadline,
            isPriority: isPriority || false,
            priorityReason: isPriority ? priorityReason : '',
            qrCodeToken
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

        // Generate Notification for User
        await Notification.create({
            userId,
            message: `Your booking request for ${facility.name} on ${date} has been submitted.`,
            type: 'booking_submitted',
            bookingId: createdBooking._id
        });

        // Generate Notification for Admins if Priority
        if (isPriority) {
            const admins = await User.find({ role: { $in: ['admin', 'staff'] } });
            const notifications = admins.map(admin => ({
                userId: admin._id,
                message: `URGENT: Priority booking requested for ${facility.name} by ${req.user.name}.`,
                type: 'priority_request',
                bookingId: createdBooking._id
            }));
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        }

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
        const { status, sortBy = 'priority' } = req.query;
        const query = {};
        if (status) query.status = status;

        let bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .populate('facilityServiceId', 'name type')
            .populate('slotId', 'startTime endTime');

        // Sort by priority first, then by createdAt
        if (sortBy === 'priority') {
            bookings.sort((a, b) => {
                // Priority bookings first
                if (a.isPriority !== b.isPriority) {
                    return b.isPriority - a.isPriority;
                }
                // Then by created date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else if (sortBy === 'date') {
            bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

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
        const { status, rejectReason, priorityVerified } = req.body;
        const booking = await Booking.findById(req.params.id)
            .populate('facilityServiceId', 'name')
            .populate('userId', 'name email');
        
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Can only update pending bookings' });
        }

        // Handle priority booking verification
        if (booking.isPriority && priorityVerified !== undefined) {
            booking.priorityVerified = priorityVerified;
            if (!priorityVerified) {
                // If priority claim is invalid, downgrade to normal
                booking.isPriority = false;
            }
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

        booking.notificationSent.approved = false; // Reset to send fresh notification
        const updatedBooking = await booking.save();

        // Notify user about status change
        const notificationMessage = status === 'approved' 
            ? `Your booking for ${booking.facilityServiceId.name} on ${booking.date} has been approved.`
            : `Your booking for ${booking.facilityServiceId.name} on ${booking.date} was rejected: ${rejectReason}`;

        await Notification.create({
            userId: booking.userId._id,
            facilityServiceId: booking.facilityServiceId._id,
            message: notificationMessage,
            type: `booking_${status}`,
            bookingId: booking._id,
            priority: booking.isPriority ? 'high' : 'normal'
        });

        res.json(updatedBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Scan QR Code for Check-in
// @route   POST /api/bookings/scan
// @access  Admin/Staff
const scanQRCode = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'QR Code token is required' });

        const booking = await Booking.findOne({ qrCodeToken: token })
            .populate('userId', 'name email')
            .populate('facilityServiceId', 'name type');

        if (!booking) {
            return res.status(404).json({ message: 'Invalid or expired QR code.' });
        }

        if (booking.status === 'checked-in' || booking.status === 'completed') {
            return res.status(400).json({ message: 'Booking has already been checked-in/completed.' });
        }

        if (booking.status !== 'approved') {
            return res.status(400).json({ message: `Cannot check in. Booking status is ${booking.status}.` });
        }

        // Validate check-in time specifically: 15 mins before to 15 mins after
        const now = new Date();
        const [startH, startM] = booking.startTime.split(':');
        const slotStart = new Date(booking.date);
        slotStart.setHours(parseInt(startH), parseInt(startM), 0);

        const checkInStart = new Date(slotStart.getTime() - 15 * 60000);
        const checkInEnd = new Date(slotStart.getTime() + 15 * 60000);

        if (now < checkInStart) {
            return res.status(400).json({ message: 'Too early to check in. Check-in opens 15 mins before your slot start time.' });
        }
        if (now > checkInEnd) {
            return res.status(400).json({ message: 'Too late to check in. Check-in closed 15 mins after slot start time.' });
        }

        booking.status = 'checked-in';
        booking.checkInTime = now;
        await booking.save();

        res.json({ message: 'Check-in successful. Enjoy your session!', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete a Booking
// @route   PUT /api/bookings/:id/complete
// @access  Admin/Staff
const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'checked-in' && booking.status !== 'approved') {
            return res.status(400).json({ message: `Cannot complete a ${booking.status} booking.` });
        }

        booking.status = 'completed';
        
        // Free up slot capacity since it's done
        const slot = await Slot.findById(booking.slotId);
        if (slot) {
            slot.booked = Math.max(0, slot.booked - booking.participants);
            if (slot.status === 'full') slot.status = 'available';
            await slot.save();
        }

        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Feedback for a Booking
// @route   POST /api/bookings/:id/rate
// @access  Student
const submitFeedback = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Provide a valid rating between 1 and 5' });
        }

        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id })
            .populate('facilityServiceId', 'name');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'Feedback can only be submitted for completed bookings.' });
        }

        if (booking.rating) {
            return res.status(400).json({ message: 'You have already submitted feedback for this booking.' });
        }

        booking.rating = rating;
        booking.feedback = feedback || '';
        await booking.save();

        res.json({ message: 'Thank you for your feedback!', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    scanQRCode,
    completeBooking,
    submitFeedback
};
