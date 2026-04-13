const Booking = require('../models/Booking');

// @desc    Get dashboard reports
// @route   GET /api/reports/dashboard
// @access  Admin/Staff
const getDashboardMetrics = async (req, res) => {
    try {
        // Query params to filter conditionally could be extracted here

        const totalBookings = await Booking.countDocuments();
        
        const statusCounts = await Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const facilityCounts = await Booking.aggregate([
            { $group: { _id: "$facilityServiceId", count: { $sum: 1 } } },
            { $lookup: { from: 'facilityservices', localField: '_id', foreignField: '_id', as: 'facility' } },
            { $unwind: "$facility" },
            { $project: { name: "$facility.name", count: 1 } }
        ]);

        // simple metrics mapping
        const metrics = {
            totalBookings,
            statuses: statusCounts,
            popularFacilities: facilityCounts
        };

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback reports
// @route   GET /api/reports/feedback
// @access  Admin/Staff
const getFeedbackReports = async (req, res) => {
    try {
        const feedbacks = await Booking.find({ rating: { $exists: true } })
            .select('rating feedback date facilityServiceId userId')
            .populate('facilityServiceId', 'name type')
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 });

        const averageRatings = await Booking.aggregate([
            { $match: { rating: { $exists: true } } },
            { $group: { 
                _id: "$facilityServiceId", 
                avgRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            } },
            { $lookup: { from: 'facilityservices', localField: '_id', foreignField: '_id', as: 'facility' } },
            { $unwind: "$facility" },
            { $project: { name: "$facility.name", avgRating: { $round: ["$avgRating", 1] }, totalRatings: 1 } }
        ]);

        res.json({
            recentFeedback: feedbacks,
            averages: averageRatings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardMetrics,
    getFeedbackReports
};
