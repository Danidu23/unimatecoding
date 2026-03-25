const express = require('express');
const router = express.Router();

const {
  registerStudent,
  loginUser,
  getCurrentUser,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, changePassword);

module.exports = router;