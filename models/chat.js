const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  message: { type: String },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
