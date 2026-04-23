const SportsBooking = require('../models/SportsBooking');
const SportsSlot = require('../models/SportsSlot');
const SportsGlobalRules = require('../models/SportsGlobalRules');
const SportsNotification = require('../models/SportsNotification');
const User = require('../models/User');
const crypto = require('crypto');

// Helper to get global rules falling back to defaults
const getGlobalRules = async () => {
    let rules = await SportsGlobalRules.findOne();
    if (!rules) {
        rules = await SportsGlobalRules.create({});
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

        const slot = await SportsSlot.findById(slotId).populate('facilityServiceId');
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
        const existingBooking = await SportsBooking.findOne({
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

        const dailyBookingsCount = await SportsBooking.countDocuments({
            userId,
            date: date,
            status: { $in: ['pending', 'approved'] }
        });

        if (dailyBookingsCount >= rules.maxBookingsPerDay) {
            return res.status(400).json({ message: `Daily booking limit (${rules.maxBookingsPerDay}) reached` });
        }

        // Determine cancellation deadline
        const [year, month, day] = String(date).split('-').map(Number);
        const [startHour, startMinute] = String(slot.startTime).split(':').map(Number);

        const slotDateTime = new Date(year, month - 1, day, startHour, startMinute, 0, 0);

        if (Number.isNaN(slotDateTime.getTime())) {
            return res.status(400).json({ message: 'Invalid slot date/time for booking' });
        }

        const cancelHours = facility.type === 'service'
            ? rules.serviceCancelHoursBefore
            : rules.sportsCancelHoursBefore;

        const cancelDeadline = new Date(
            slotDateTime.getTime() - cancelHours * 60 * 60 * 1000
        );

        if (Number.isNaN(cancelDeadline.getTime())) {
            return res.status(400).json({ message: 'Invalid cancellation deadline calculation' });
        }

        // Create booking
        const booking = new SportsBooking({
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
            qrCode: crypto.randomBytes(16).toString('hex'),
            attendanceStatus: 'pending'
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

        // Generate notification for user
        await SportsNotification.create({
            userId,
            facilityServiceId: facility._id,
            message: `Your booking request for ${facility.name} on ${date} has been submitted.`,
            type: 'booking_submitted',
            bookingId: createdBooking._id
        });

        // Generate notification for sports admins if priority
        if (isPriority) {
            const sportsAdmins = await User.find({
                role: 'admin',
                permissions: 'sports_admin'
            });

            const notifications = sportsAdmins.map(admin => ({
                userId: admin._id,
                facilityServiceId: facility._id,
                message: `URGENT: Priority booking requested for ${facility.name} by ${req.user.name}.`,
                type: 'priority_request',
                bookingId: createdBooking._id,
                priority: 'high'
            }));

            if (notifications.length > 0) {
                await SportsNotification.insertMany(notifications);
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
        const bookings = await SportsBooking.find({ userId: req.user._id })
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
        const booking = await SportsBooking.findOne({ _id: req.params.id, userId: req.user._id });
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
        const slot = await SportsSlot.findById(booking.slotId);
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
// @access  Sports Admin
const getAllBookings = async (req, res) => {
    try {
        const { status, sortBy = 'priority' } = req.query;
        const query = {};
        if (status) query.status = status;

        let bookings = await SportsBooking.find(query)
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
// @access  Sports Admin
const updateBookingStatus = async (req, res) => {
    try {
        const { status, rejectReason, priorityVerified } = req.body;
        const booking = await SportsBooking.findById(req.params.id)
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
            const slot = await SportsSlot.findById(booking.slotId);
            if (slot) {
                slot.booked -= booking.participants;
                if (slot.status === 'full') slot.status = 'available';
                await slot.save();
            }
        } else if (status === 'approved') {
            // Check conflict for single-book slots
            const slot = await SportsSlot.findById(booking.slotId);
            if (slot && slot.capacity === 1) {
                const otherApproved = await SportsBooking.find({ slotId: slot._id, status: 'approved' });
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

        await SportsNotification.create({
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

// @desc    Check-in a booking via QR code
// @route   PUT /api/bookings/:id/check-in
// @access  Staff/Admin
const checkInBooking = async (req, res) => {
    try {
        const { qrCode } = req.body;
        const booking = await SportsBooking.findById(req.params.id)
            .populate('facilityServiceId', 'name');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Validate QR Code
        if (booking.qrCode !== qrCode) {
            return res.status(400).json({ message: 'Invalid QR code' });
        }

        // Check if already checked in
        if (booking.attendanceStatus !== 'pending') {
            return res.status(400).json({ message: `Already ${booking.attendanceStatus}` });
        }

        // Check time window (e.g., 15 mins before to 15 mins after start time)
        const [year, month, day] = booking.date.split('-').map(Number);
        const [hour, minute] = booking.startTime.split(':').map(Number);
        const startTime = new Date(year, month - 1, day, hour, minute);
        
        const now = new Date();
        const diffMinutes = (now - startTime) / (1000 * 60);

        if (diffMinutes < -15) {
            return res.status(400).json({ message: 'Too early for check-in. Please wait until 15 mins before start time.' });
        }
        if (diffMinutes > 15) {
            booking.attendanceStatus = 'no-show';
            await booking.save();
            return res.status(400).json({ message: 'Check-in window has passed. Marked as No-show.' });
        }

        booking.attendanceStatus = 'checked-in';
        booking.checkInTime = now;
        // Also update main status to show it's active/in-progress
        booking.status = 'approved'; 
        
        await booking.save();

        res.json({
            message: 'Check-in successful. Enjoy your session!',
            booking
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manually complete a booking (or via automated task)
// @route   PUT /api/bookings/:id/complete
// @access  Staff/Admin
const completeBooking = async (req, res) => {
    try {
        const booking = await SportsBooking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.attendanceStatus !== 'checked-in') {
            return res.status(400).json({ message: 'Can only complete checked-in bookings' });
        }

        booking.status = 'completed';
        booking.attendanceStatus = 'completed';
        await booking.save();

        res.json({ message: 'Booking marked as completed', booking });
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
    checkInBooking,
    completeBooking
};
