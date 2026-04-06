const LostItem = require('../models/LostItem.js').default || require('../models/LostItem.js');
const FoundItem = require('../models/FoundItem.js').default || require('../models/FoundItem.js');
const mongoose = require('mongoose');

// @desc    Create a Lost Item Report
// @route   POST /api/items/lost
exports.createLostItem = async (req, res) => {
    try {
        const { title, category, location, date, desc, contactNo, email, image } = req.body;
        
        // Mock userId since auth is not fully integrated in frontend yet
        const mockUserId = new mongoose.Types.ObjectId();

        const newLostItem = new LostItem({
            userId: mockUserId,
            itemName: title,
            category: category,
            lastSeenLocation: location,
            dateLost: date,
            description: `${desc} (Email: ${email})`,
            contact: contactNo,
            image: image,
            status: 'Pending'
        });

        await newLostItem.save();
        res.status(201).json({ success: true, data: newLostItem });
    } catch (error) {
        console.error('Error in createLostItem:', error);
        res.status(500).json({ success: false, message: 'Failed to save lost item' });
    }
};

// @desc    Create a Found Item Report
// @route   POST /api/items/found
exports.createFoundItem = async (req, res) => {
    try {
        const { title, category, location, date, desc, contactNo, email, image } = req.body;
        
        const newFoundItem = new FoundItem({
            itemName: title,
            locationFound: location,
            dateFound: date,
            description: `Category: ${category}. ${desc} (Email: ${email})`,
            finderContact: contactNo,
            image: image,
            status: 'Pending'
        });

        await newFoundItem.save();
        res.status(201).json({ success: true, data: newFoundItem });
    } catch (error) {
        console.error('Error in createFoundItem:', error);
        res.status(500).json({ success: false, message: 'Failed to save found item' });
    }
};

// @desc    Get all active lost items
// @route   GET /api/items/lost
exports.getLostItems = async (req, res) => {
    try {
        const items = await LostItem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lost items' });
    }
};

// @desc    Get all active found items
// @route   GET /api/items/found
exports.getFoundItems = async (req, res) => {
    try {
        const items = await FoundItem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch found items' });
    }
};
