const express = require('express');
const router = express.Router();
const { createLostItem, createFoundItem, getLostItems, getFoundItems, getLostItemById, getFoundItemById, reviewLostItem, reviewFoundItem } = require('../controllers/itemController');

router.post('/lost', createLostItem);
router.post('/found', createFoundItem);

router.get('/lost', getLostItems);
router.get('/found', getFoundItems);
router.get('/lost/:id', getLostItemById);
router.get('/found/:id', getFoundItemById);
router.patch('/lost/:id/review', reviewLostItem);
router.patch('/found/:id/review', reviewFoundItem);

module.exports = router;
