const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Application = require('../models/Application');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Apply protect + adminOnly to all routes below
router.use(protect, adminOnly);

// ─── CLUBS ───────────────────────────────────────────────────────────────────

// GET /api/admin/clubs
router.get('/clubs', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/admin/clubs
router.post('/clubs', async (req, res) => {
  try {
    let { name, category, description, tags, logoUrl, about, gallery } = req.body;
    name = name?.trim();
    description = description?.trim();
    about = about?.trim();

    if (!name || !category || !description)
      return res.status(400).json({ message: 'Name, category, and description are required.' });

    if (name.length < 3 || name.length > 100)
      return res.status(400).json({ message: 'Club name must be between 3 and 100 characters.' });

    const categories = ['Technology', 'Leadership', 'Arts', 'Sports', 'Cultural', 'Science', 'Business', 'Media'];
    if (!categories.includes(category))
      return res.status(400).json({ message: 'Invalid category selected.' });

    const club = await Club.create({ 
      name, 
      category, 
      description, 
      about: about || '',
      tags: tags || [], 
      logoUrl: logoUrl || '',
      gallery: gallery || []
    });
    res.status(201).json({ message: 'Club created successfully.', club });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/clubs/:id
router.put('/clubs/:id', async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!club) return res.status(404).json({ message: 'Club not found.' });
    res.json({ message: 'Club updated successfully.', club });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/clubs/:id
router.delete('/clubs/:id', async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found.' });
    // Also remove related applications
    await Application.deleteMany({ clubId: req.params.id });
    res.json({ message: 'Club deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────

// GET /api/admin/applications
router.get('/applications', async (req, res) => {
  try {
    const filter = {};
    if (req.query.clubId) filter.clubId = req.query.clubId;
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter)
      .populate('clubId', 'name category')
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/applications/:id - Approve or Reject
router.put('/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be Approved or Rejected.' });

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, reviewedAt: new Date() },
      { new: true }
    ).populate('clubId', 'name category').populate('studentId', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: `Application ${status}.`, application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── MEMBERS ──────────────────────────────────────────────────────────────────

// GET /api/admin/clubs/:id/members
router.get('/clubs/:id/members', async (req, res) => {
  try {
    const members = await Application.find({ clubId: req.params.id, status: 'Approved' })
      .populate('studentId', 'name email studentId')
      .sort({ reviewedAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/applications/:id/remove-member
router.delete('/applications/:id/remove-member', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', reviewedAt: new Date() },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Member removed from club.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/stats - Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalClubs, totalApplications, totalMembers, pendingCount] = await Promise.all([
      Club.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Approved' }),
      Application.countDocuments({ status: 'Pending' }),
    ]);
    res.json({ totalClubs, totalApplications, totalMembers, pendingCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
