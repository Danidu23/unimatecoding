const express = require('express');
const router = express.Router();
const {
    getSmartSuggestions,
    getOccupancyInfo,
    getPriorityStats,
    checkConflicts
} = require('../controllers/smartController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// Student routes
router.get('/suggestions', getSmartSuggestions);
router.get('/occupancy', getOccupancyInfo);
router.post('/check-conflicts', checkConflicts);

// Admin routes
router.get('/priority-stats', restrictTo('admin', 'staff'), getPriorityStats);

module.exports = router;
