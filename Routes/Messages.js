const express = require('express');
const router = express.Router();
const Message = require('../Models/Message');
const authenticateToken = require('../MIddleware/Authentication');

router.post('/', authenticateToken, async (req, res) => {
  const { reportId, recipientId, content } = req.body;
  const senderId = req.user.user_id; 

  try {
    const message = new Message({
      reportId,
      senderId, 
      recipientId,  
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err });
  }
});
router.get('/:reportId', authenticateToken, async (req, res) => {
  const { reportId } = req.params;

  try {
    const messages = await Message.find({ reportId });

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this report.' });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve messages', error: err });
  }
});

module.exports = router;
