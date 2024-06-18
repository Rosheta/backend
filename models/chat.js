const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId_1: {
    type: String,
    required: true
  },
  userId_2: {
    type: String,
    required: true
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
