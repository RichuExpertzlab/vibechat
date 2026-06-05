const Message = require('../models/Message');

// Send Message
const sendMessage = async (req, res) => {
  try {

    const { roomId, content } = req.body;

    const message = await Message.create({
      roomId,
      sender: req.user.id,
      content
    });

    res.status(201).json({
      success: true,
      message
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Get Room Messages
const getMessages = async (req, res) => {
  try {

    const { roomId } = req.params;

    const messages = await Message.find({
      roomId
    })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Get Private Messages
const getPrivateMessages = async (req, res) => {
  try {

    const { user1, user2 } = req.params;

    const messages = await Message.find({

      $or: [

        {
          sender: user1,
          receiver: user2
        },

        {
          sender: user2,
          receiver: user1
        }

      ]

    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  sendMessage,
  getMessages,
  getPrivateMessages
};