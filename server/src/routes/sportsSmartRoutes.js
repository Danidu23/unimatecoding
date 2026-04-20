const express = require('express');
const router = express.Router();
const {
    getSmartSuggestions,
    getOccupancyInfo,
    getPriorityStats,
    checkConflicts
} = require('../controllers/sportsSmartController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin } = require('../middleware/roleMiddleware');

router.use(protect);

// Student routes
router.get('/suggestions', getSmartSuggestions);
router.get('/occupancy', getOccupancyInfo);
router.post('/check-conflicts', checkConflicts);

// Sports manager routes
router.get('/priority-stats', requireSportsAdmin, getPriorityStats);

module.exports = router;