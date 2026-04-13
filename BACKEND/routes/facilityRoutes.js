const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility
} = require('../controllers/facilityController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFacilities)
    .post(protect, restrictTo('admin', 'staff'), createFacility);

router.route('/:id')
    .get(protect, getFacilityById)
    .put(protect, restrictTo('admin', 'staff'), updateFacility);

module.exports = router;
