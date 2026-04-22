const express = require('express');
const router = express.Router();
const { getRules, updateRules } = require('../controllers/sportsRulesController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin, requireAdmin } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, requireSportsAdmin, getRules)
    .put(protect, requireAdmin, updateRules);

module.exports = router;