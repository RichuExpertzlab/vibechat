const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getMessages,
  getPrivateMessages
} = require('../controllers/chat.controller');

const { protect } = require('../middleware/auth');

router.get('/:roomId', protect, getMessages);

router.get(
  '/private/:user1/:user2',
  protect,
  getPrivateMessages
);

router.post('/', protect, sendMessage);

module.exports = router;