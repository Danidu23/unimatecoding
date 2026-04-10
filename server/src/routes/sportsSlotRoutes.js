const express = require('express');
const router = express.Router();
const {
    getSlots,
    generateSlots,
    toggleBlockSlot
} = require('../controllers/sportsSlotController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsManager } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getSlots);

router.post('/generate', protect, requireSportsManager, generateSlots);
router.put('/:id/block', protect, requireSportsManager, toggleBlockSlot);

module.exports = router;
