const Claim = require('../models/Claim.js').default || require('../models/Claim.js');
const FoundItem = require('../models/FoundItem.js').default || require('../models/FoundItem.js');
const mongoose = require('mongoose');

exports.createClaim = async (req, res) => {
  try {
    const { itemId, explanation, identifier, proofImage, claimantEmail } = req.body;

    const claim = new Claim({
      userId: new mongoose.Types.ObjectId(),
      itemId,
      explanation: `${explanation}${claimantEmail ? ` (Email: ${claimantEmail})` : ''}`,
      identifier,
      proofImage,
      status: 'Pending'
    });

    await claim.save();
    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ success: false, message: 'Failed to create claim' });
  }
};

exports.getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 }).populate('itemId');
    res.json({ success: true, data: claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch claims' });
  }
};

exports.reviewClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reviewNote } = req.body;
    const status = action === 'approve' ? 'Approved' : 'Rejected';

    const claim = await Claim.findByIdAndUpdate(
      id,
      { status, reviewNote, reviewedAt: new Date() },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    if (status === 'Approved') {
      await FoundItem.findByIdAndUpdate(claim.itemId, { status: 'Claimed', reviewedAt: new Date() });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    console.error('Error reviewing claim:', error);
    res.status(500).json({ success: false, message: 'Failed to review claim' });
  }
};
