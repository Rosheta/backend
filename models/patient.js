const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String
  },
  phone_number: {
    type: String,
    unique: true
  },
  ssn: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function(email) {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String },
  d_o_b: { type: Date },
  gender: {
    type: String,
    enum: ['m', 'f']
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
