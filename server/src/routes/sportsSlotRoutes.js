const express = require('express');
const router = express.Router();
const {
    getSlots,
    generateSlots,
    toggleBlockSlot
} = require('../controllers/sportsSlotController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getSlots);

router.post('/generate', protect, requireSportsAdmin, generateSlots);
router.put('/:id/block', protect, requireSportsAdmin, toggleBlockSlot);

module.exports = router;
