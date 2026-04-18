const FacilityService = require('../models/FacilityService');
const Slot = require('../models/Slot');

// @desc    Get all active facilities and services
// @route   GET /api/facilities
// @access  Public / Student
const getFacilities = async (req, res) => {
    try {
        const facilities = await FacilityService.aggregate([
            { $match: { active: true } },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'facilityServiceId',
                    as: 'bookingRatings'
                }
            },
            {
                $addFields: {
                    ratedBookings: {
                        $filter: {
                            input: "$bookingRatings",
                            as: "b",
                            cond: { $gt: ["$$b.rating", 0] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$ratedBookings.rating" },
                    totalRatings: { $size: "$ratedBookings" }
                }
            },
            {
                $project: {
                    bookingRatings: 0,
                    ratedBookings: 0
                }
            }
        ]);
        
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get facility/service by ID
// @route   GET /api/facilities/:id
// @access  Public / Student
const getFacilityById = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const facilityId = new mongoose.Types.ObjectId(req.params.id);
        
        const facilities = await FacilityService.aggregate([
            { $match: { _id: facilityId } },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'facilityServiceId',
                    as: 'bookingRatings'
                }
            },
            {
                $addFields: {
                    ratedBookings: {
                        $filter: {
                            input: "$bookingRatings",
                            as: "b",
                            cond: { $gt: ["$$b.rating", 0] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$ratedBookings.rating" },
                    totalRatings: { $size: "$ratedBookings" }
                }
            },
            {
                $project: {
                    bookingRatings: 0,
                    ratedBookings: 0
                }
            }
        ]);

        if (facilities.length > 0) {
            res.json(facilities[0]);
        } else {
            res.status(404).json({ message: 'Facility/Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new facility/service
// @route   POST /api/facilities
// @access  Admin/Staff
const createFacility = async (req, res) => {
    try {
        const facility = new FacilityService(req.body);
        const createdFacility = await facility.save();
        res.status(201).json(createdFacility);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a facility/service
// @route   PUT /api/facilities/:id
// @access  Admin/Staff
const updateFacility = async (req, res) => {
    try {
        const facility = await FacilityService.findById(req.params.id);
        if (facility) {
            Object.assign(facility, req.body);
            const updatedFacility = await facility.save();
            res.json(updatedFacility);
        } else {
            res.status(404).json({ message: 'Facility/Service not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility
};
