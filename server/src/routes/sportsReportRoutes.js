const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/sportsReportController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin } = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, requireSportsAdmin, getDashboardMetrics);

module.exports = router;