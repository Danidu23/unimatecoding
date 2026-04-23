const express = require('express');
const router = express.Router();
const {
    submitFeedback,
    getFacilityFeedback
} = require('../controllers/sportsFeedbackController');
const { protect } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

// Student routes
router.post('/', protect, requireStudent, submitFeedback);

// Public/Student routes
router.get('/facility/:id', getFacilityFeedback);

module.exports = router;
