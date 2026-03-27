const express = require('express');
const router = express.Router();

const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  updateMenuAvailability,
  deleteMenuItem
} = require('../controllers/menuController');

const { protect } = require('../middleware/authMiddleware');
const { requireStaff } = require('../middleware/roleMiddleware');

router.get('/', protect, getMenuItems);
router.post('/', protect, requireStaff, createMenuItem);
router.put('/:id', protect, requireStaff, updateMenuItem);
router.patch('/:id/availability', protect, requireStaff, updateMenuAvailability);
router.delete('/:id', protect, requireStaff, deleteMenuItem);

module.exports = router;