const express = require('express');
const router = express.Router();
const { createLostItem, createFoundItem, getLostItems, getFoundItems } = require('../controllers/itemController');

router.post('/lost', createLostItem);
router.post('/found', createFoundItem);

router.get('/lost', getLostItems);
router.get('/found', getFoundItems);

module.exports = router;
