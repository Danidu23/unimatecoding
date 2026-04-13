const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getFeedbackReports } = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, restrictTo('admin', 'staff'), getDashboardMetrics);
router.get('/feedback', protect, restrictTo('admin', 'staff'), getFeedbackReports);

module.exports = router;
