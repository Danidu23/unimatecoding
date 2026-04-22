const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility
} = require('../controllers/sportsFacilityController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getFacilities)
    .post(protect, requireSportsAdmin, createFacility);

router.route('/:id')
    .get(protect, getFacilityById)
    .put(protect, requireSportsAdmin, updateFacility);

module.exports = router;
