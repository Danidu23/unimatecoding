const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// POST /api/applications - Submit a membership application
router.post('/', protect, async (req, res) => {
  try {
    let { clubId, studentName, studentIdNumber, preferredRole, reason } = req.body;
    studentName = studentName?.trim();
    studentIdNumber = studentIdNumber?.trim()?.toUpperCase();
    reason = reason?.trim();

    if (!clubId || !studentName || !studentIdNumber || !preferredRole || !reason)
      return res.status(400).json({ message: 'All fields are required.' });

    if (!/^[A-Za-z\s]{3,50}$/.test(studentName))
      return res.status(400).json({ message: 'Please enter a valid name (3-50 letters).' });

    if (!/^IT\d{7}$/.test(studentIdNumber))
      return res.status(400).json({ message: 'Invalid Student ID (e.g., IT2324616).' });

    if (reason.length < 50 || reason.length > 500)
      return res.status(400).json({ message: 'Reason must be between 50 and 500 characters.' });

    const existing = await Application.findOne({ studentId: req.user._id, clubId });
    if (existing) return res.status(400).json({ message: 'You have already applied to this club.' });

    const application = await Application.create({
      studentId: req.user._id,
      clubId,
      studentName,
      studentIdNumber: studentIdNumber.toUpperCase(),
      preferredRole,
      reason,
    });

    await application.populate('clubId', 'name category');
    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already applied to this club.' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/applications/my - Get current student's applications
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('clubId', 'name category logoUrl')
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
