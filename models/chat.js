const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  userId_1: { type: String },
  userId_2: { type: String }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
