const express = require('express');
const router = express.Router();

const {
  registerStudent,
  loginUser,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require('../middleware/authMiddleware');

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getCurrentUser);
router.put("/change-password", protect, changePassword);

module.exports = router;