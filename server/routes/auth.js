const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    let { name, studentId, email, password } = req.body;
    name = name?.trim();
    studentId = studentId?.trim()?.toUpperCase();
    email = email?.trim()?.toLowerCase();

    if (!name || !studentId || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    if (!/^[A-Za-z\s]{3,50}$/.test(name))
      return res.status(400).json({ message: 'Name must be 3-50 letters only.' });

    if (!/^IT\d{7}$/.test(studentId))
      return res.status(400).json({ message: 'Invalid Student ID (e.g., IT2324616).' });

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address.' });

    if (password.length < 8 || !/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password))
      return res.status(400).json({ message: 'Password must be 8+ chars with a number and special character.' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use.' });

    const existingId = await User.findOne({ studentId });
    if (existingId) return res.status(400).json({ message: 'Student ID already registered.' });

    const user = await User.create({ name, studentId, email, password, role: 'student' });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
