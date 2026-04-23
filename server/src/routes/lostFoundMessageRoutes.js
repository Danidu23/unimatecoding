const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  markMessageAsSeen,
  getUnreadCount
} = require('../controllers/lostFoundMessageController');

router.post('/', createConversation);
router.get('/', getConversations);
router.post('/:id/messages', sendMessage);
router.get('/unread/count', getUnreadCount);
router.get('/:id', getConversationById);
router.patch('/message/:id/seen', markMessageAsSeen);

module.exports = router;