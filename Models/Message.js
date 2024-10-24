const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  reportId: String,
  senderId:Number,
  recipientId: Number,
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
