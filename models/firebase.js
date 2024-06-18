const mongoose = require('mongoose');

const firebaseScheme = new mongoose.Schema({  
  username: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

const firebase = mongoose.model('firebase', firebaseScheme);

module.exports = firebase;
