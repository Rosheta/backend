const mongoose = require('mongoose');

const messagesScheme = new mongoose.Schema({  
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  isSeen: {
    type: Boolean,
    default: false
  }
});

const Messages = mongoose.model('messages', messagesScheme);

module.exports = Messages;
