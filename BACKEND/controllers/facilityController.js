const FacilityService = require('../models/FacilityService');
const Slot = require('../models/Slot');

// @desc    Get all active facilities and services
// @route   GET /api/facilities
// @access  Public / Student
const getFacilities = async (req, res) => {
    try {
        const facilities = await FacilityService.find({ active: true });
        
        // Let's add available availability status logic
        // This is a complex query to check future slot availability; for this scale, 
        // we can return them and let frontend fetch slots based on date or just return them directly.
        
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
        const facility = await FacilityService.findById(req.params.id);
        if (facility) {
            res.json(facility);
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
