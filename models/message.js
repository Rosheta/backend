const mongoose = require('mongoose');

const messagesScheme = new mongoose.Schema({  
  chatId: { type: Number, required: true, unique: true },
  message:{type:String},
  sender: { type: String },
  receiver: { type: String },
  timestamp: { type: Date, default: Date.now},
  isSeen:{type: Boolean, default: false}
});

const Messages = mongoose.model('messages', messagesScheme);

module.exports = Messages;
