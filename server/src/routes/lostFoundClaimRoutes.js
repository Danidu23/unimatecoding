const express = require('express');
const router = express.Router();
const { createClaim, getClaims, reviewClaim } = require('../controllers/lostFoundClaimController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createClaim);
router.get('/', getClaims);
router.patch('/:id/review', reviewClaim);

module.exports = router;