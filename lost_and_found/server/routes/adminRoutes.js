const express = require('express');
const router = express.Router();
const { getAdminSummary } = require('../controllers/itemController');

router.get('/summary', getAdminSummary);

module.exports = router;
