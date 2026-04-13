const express = require('express');
const router = express.Router();
const {
    getSlots,
    generateSlots,
    toggleBlockSlot
} = require('../controllers/slotController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSlots);

router.post('/generate', protect, restrictTo('admin', 'staff'), generateSlots);
router.put('/:id/block', protect, restrictTo('admin', 'staff'), toggleBlockSlot);

module.exports = router;
