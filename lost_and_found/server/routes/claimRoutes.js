const express = require('express');
const router = express.Router();
const { createClaim, getClaims, reviewClaim } = require('../controllers/claimController');

router.post('/', createClaim);
router.get('/', getClaims);
router.patch('/:id/review', reviewClaim);

module.exports = router;
