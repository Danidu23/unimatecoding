const express = require('express');
const router = express.Router();
const { getRules, updateRules } = require('../controllers/sportsRulesController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsManager, requireAdmin } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, requireSportsManager, getRules)
    .put(protect, requireAdmin, updateRules);

module.exports = router;