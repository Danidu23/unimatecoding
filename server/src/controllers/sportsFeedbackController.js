const SportsFeedback = require('../models/SportsFeedback');
const SportsBooking = require('../models/SportsBooking');
const SportsFacilityService = require('../models/SportsFacilityService');

// @desc    Submit feedback for a completed booking
// @route   POST /api/sports-feedback
// @access  Student
const submitFeedback = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const userId = req.user._id;

        const booking = await SportsBooking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Check if booking belongs to user
        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to rate this booking' });
        }

        // Check if booking is completed
        if (booking.status !== 'completed' && booking.attendanceStatus !== 'completed') {
            return res.status(400).json({ message: 'Can only rate completed bookings' });
        }

        // Check if feedback already submitted
        const existingFeedback = await SportsFeedback.findOne({ bookingId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this booking' });
        }

        // Create feedback
        const feedback = await SportsFeedback.create({
            bookingId,
            userId,
            facilityServiceId: booking.facilityServiceId,
            rating,
            comment
        });

        // Update facility average rating
        const facility = await SportsFacilityService.findById(booking.facilityServiceId);
        if (facility) {
            const totalRatingScore = (facility.averageRating * facility.numRatings) + rating;
            facility.numRatings += 1;
            facility.averageRating = Number((totalRatingScore / facility.numRatings).toFixed(1));
            await facility.save();
        }

        // Mark booking as feedback submitted
        booking.feedbackSubmitted = true;
        await booking.save();

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback for a facility
// @route   GET /api/sports-feedback/facility/:id
// @access  Public/Student
const getFacilityFeedback = async (req, res) => {
    try {
        const feedback = await SportsFeedback.find({ facilityServiceId: req.params.id })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitFeedback,
    getFacilityFeedback
};
