const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  hash: {
    type: String,
    required: [true, 'Hash is required']
  },
  name: {
    type: String,
    required: [true, 'File name is required']
  },
  extension: {
    type: String,
    required: [true, 'File extension is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
