const LostFoundConversation = require('../models/LostFoundConversation');
const LostFoundMessage = require('../models/LostFoundMessage');

exports.createConversation = async (req, res) => {
  try {
    const { participantIds, participantNames, participantAvatars, itemId, itemTitle } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 participants required' });
    }

    const existing = await LostFoundConversation.findOne({
      participantIds: { $all: participantIds },
      itemId
    });

    if (existing) {
      return res.status(200).json({ success: true, data: existing });
    }

    const conversation = new LostFoundConversation({
      participantIds,
      participantNames,
      participantAvatars,
      itemId,
      itemTitle,
      lastMessage: 'Conversation started',
      unreadCount: new Map(participantIds.map((id) => [String(id), 0]))
    });

    await conversation.save();
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to create conversation' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { participantId } = req.query;

    if (!participantId) {
      return res.status(400).json({ success: false, message: 'participantId required' });
    }

    const conversations = await LostFoundConversation.find({
      participantIds: participantId
    }).sort({ lastMessageTime: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await LostFoundConversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await LostFoundMessage.find({ conversationId: id }).sort({ createdAt: 1 });

    res.json({ success: true, data: { conversation, messages } });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversation' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderName, text } = req.body;

    if (!conversationId || !senderId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const conversation = await LostFoundConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const message = new LostFoundMessage({
      conversationId,
      senderId,
      senderName,
      text: text.trim(),
      seen: false
    });

    await message.save();

    conversation.lastMessage = text.trim();
    conversation.lastMessageTime = new Date();
    await conversation.save();

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

exports.markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await LostFoundMessage.findByIdAndUpdate(
      id,
      { seen: true, seenAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Error marking message as seen:', error);
    res.status(500).json({ success: false, message: 'Failed to mark message' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { conversationId, userId } = req.query;

    if (!conversationId || !userId) {
      return res.status(400).json({ success: false, message: 'conversationId and userId required' });
    }

    const unreadCount = await LostFoundMessage.countDocuments({
      conversationId,
      senderId: { $ne: userId },
      seen: false
    });

    res.json({ success: true, data: { unreadCount } });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};
