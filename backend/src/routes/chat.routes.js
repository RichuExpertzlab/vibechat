const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');

router.get('/:roomId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;