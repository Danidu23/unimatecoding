const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility
} = require('../controllers/sportsFacilityController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsManager } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getFacilities)
    .post(protect, requireSportsManager, createFacility);

router.route('/:id')
    .get(protect, getFacilityById)
    .put(protect, requireSportsManager, updateFacility);

module.exports = router;
