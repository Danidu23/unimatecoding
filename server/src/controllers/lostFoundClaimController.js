const LostFoundClaim = require("../models/LostFoundClaim");
const LostFoundFoundItem = require("../models/LostFoundFoundItem");
const mongoose = require("mongoose");

exports.createClaim = async (req, res) => {
  try {
    const { itemId, explanation, identifier, proofImage, claimantEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ success: false, message: 'Invalid found item id' });
    }

    const foundItem = await LostFoundFoundItem.findById(itemId);
    if (!foundItem) {
      return res.status(404).json({ success: false, message: "Found item not found for this claim" });
    }

    if (String(foundItem.status).toLowerCase() === "claimed") {
      return res.status(409).json({ success: false, message: "This item is already claimed" });
    }

    const existingClaim = await LostFoundClaim.findOne({
      itemId,
      status: { $in: ["Pending", "Approved"] }
    });

    if (existingClaim) {
      return res.status(409).json({ success: false, message: 'A claim already exists for this item' });
    }

    const claim = new LostFoundClaim({
      userId: req.user._id,
      itemId,
      explanation: `${explanation}${claimantEmail ? ` (Email: ${claimantEmail})` : ""}`,
      identifier,
      proofImage,
      status: "Pending"
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
    const claims = await LostFoundClaim.find().sort({ createdAt: -1 }).populate("itemId");
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

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid review action' });
    }

    const status = action === 'approve' ? 'Approved' : 'Rejected';

    const claim = await LostFoundClaim.findById(id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    if (String(claim.status).toLowerCase() !== 'pending') {
      return res.status(409).json({ success: false, message: 'This claim has already been reviewed' });
    }

    if (status === "Approved") {
      const updatedItem = await LostFoundFoundItem.findByIdAndUpdate(
        claim.itemId,
        { status: "Claimed", reviewedAt: new Date() },
        { new: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ success: false, message: "Related found item no longer exists" });
      }
    }

    claim.status = status;
    claim.reviewNote = reviewNote;
    claim.reviewedAt = new Date();
    await claim.save();

    res.json({ success: true, data: claim });
  } catch (error) {
    console.error('Error reviewing claim:', error);
    res.status(500).json({ success: false, message: 'Failed to review claim' });
  }
};
