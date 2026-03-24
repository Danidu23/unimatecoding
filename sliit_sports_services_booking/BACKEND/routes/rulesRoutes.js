const express = require('express');
const router = express.Router();
const { getRules, updateRules } = require('../controllers/rulesController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, restrictTo('admin', 'staff'), getRules)
    .put(protect, restrictTo('admin'), updateRules);

module.exports = router;
