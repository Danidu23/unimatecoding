const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, restrictTo('admin', 'staff'), getDashboardMetrics);

module.exports = router;
