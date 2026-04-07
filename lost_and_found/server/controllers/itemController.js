const LostItem = require('../models/LostItem.js').default || require('../models/LostItem.js');
const FoundItem = require('../models/FoundItem.js').default || require('../models/FoundItem.js');
const mongoose = require('mongoose');

const toDatabaseStatus = (action) => (action === 'approve' ? 'Approved' : 'Rejected');

const buildLostItemPayload = (body) => ({
    userId: new mongoose.Types.ObjectId(),
    itemName: body.title,
    category: body.category,
    lastSeenLocation: body.location,
    dateLost: body.date,
    description: `${body.desc} (Email: ${body.email})`,
    contact: body.contactNo,
    image: body.image,
    status: 'Pending'
});

const buildFoundItemPayload = (body) => ({
    itemName: body.title,
    category: body.category,
    locationFound: body.location,
    dateFound: body.date,
    description: `Category: ${body.category}. ${body.desc} (Email: ${body.email})`,
    finderContact: body.contactNo,
    image: body.image,
    status: 'Pending'
});

exports.createLostItem = async (req, res) => {
    try {
        const newLostItem = new LostItem(buildLostItemPayload(req.body));
        await newLostItem.save();
        res.status(201).json({ success: true, data: newLostItem });
    } catch (error) {
        console.error('Error in createLostItem:', error);
        res.status(500).json({ success: false, message: 'Failed to save lost item' });
    }
};

exports.createFoundItem = async (req, res) => {
    try {
        const newFoundItem = new FoundItem(buildFoundItemPayload(req.body));
        await newFoundItem.save();
        res.status(201).json({ success: true, data: newFoundItem });
    } catch (error) {
        console.error('Error in createFoundItem:', error);
        res.status(500).json({ success: false, message: 'Failed to save found item' });
    }
};

exports.getLostItems = async (req, res) => {
    try {
        const items = await LostItem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lost items' });
    }
};

exports.getFoundItems = async (req, res) => {
    try {
        const items = await FoundItem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch found items' });
    }
};

exports.getLostItemById = async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Lost item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('Error fetching lost item:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch lost item' });
    }
};

exports.getFoundItemById = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Found item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('Error fetching found item:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch found item' });
    }
};

exports.reviewLostItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reviewNote } = req.body;
        const status = toDatabaseStatus(action);
        const item = await LostItem.findByIdAndUpdate(
            id,
            { status, reviewNote, reviewedAt: new Date() },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ success: false, message: 'Lost item not found' });
        }

        res.json({ success: true, data: item });
    } catch (error) {
        console.error('Error reviewing lost item:', error);
        res.status(500).json({ success: false, message: 'Failed to review lost item' });
    }
};

exports.reviewFoundItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reviewNote } = req.body;
        const status = toDatabaseStatus(action);
        const item = await FoundItem.findByIdAndUpdate(
            id,
            { status, reviewNote, reviewedAt: new Date() },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ success: false, message: 'Found item not found' });
        }

        res.json({ success: true, data: item });
    } catch (error) {
        console.error('Error reviewing found item:', error);
        res.status(500).json({ success: false, message: 'Failed to review found item' });
    }
};

exports.getAdminSummary = async (req, res) => {
    try {
        const [lostPending, foundPending, lostApproved, foundApproved] = await Promise.all([
            LostItem.countDocuments({ status: 'Pending' }),
            FoundItem.countDocuments({ status: 'Pending' }),
            LostItem.countDocuments({ status: { $in: ['Approved', 'Matched'] } }),
            FoundItem.countDocuments({ status: { $in: ['Approved', 'Verified', 'Claimed'] } })
        ]);

        res.json({
            success: true,
            data: {
                pendingLost: lostPending,
                pendingFound: foundPending,
                approvedLost: lostApproved,
                approvedFound: foundApproved
            }
        });
    } catch (error) {
        console.error('Error loading admin summary:', error);
        res.status(500).json({ success: false, message: 'Failed to load summary' });
    }
};
