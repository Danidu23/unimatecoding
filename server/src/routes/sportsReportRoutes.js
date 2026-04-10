const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/sportsReportController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsManager } = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, requireSportsManager, getDashboardMetrics);

module.exports = router;