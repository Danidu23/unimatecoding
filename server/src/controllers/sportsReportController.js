const SportsBooking = require('../models/SportsBooking');

// @desc    Get dashboard reports
// @route   GET /api/reports/dashboard
// @access  Admin/Staff
const getDashboardMetrics = async (req, res) => {
    try {
        // Query params to filter conditionally could be extracted here

        const totalBookings = await SportsBooking.countDocuments();
        
        const statusCounts = await SportsBooking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const facilityCounts = await SportsBooking.aggregate([
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

module.exports = {
    getDashboardMetrics
};
