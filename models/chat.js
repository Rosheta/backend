const mongoose = require('mongoose');
const Counter = require('./counter'); // Import the Counter model

const chatSchema = new mongoose.Schema({
  chatId: { type: Number, unique: true },
  userId_1: { type: String },
  userId_2: { type: String }
});

// Define a pre-save middleware to generate unique sequential chatId
chatSchema.pre('save', async function(next) {
  if (!this.chatId) {
    try {
      const counter = await Counter.findByIdAndUpdate({ _id: 'chatId' }, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
      this.chatId = counter.sequence_value;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
