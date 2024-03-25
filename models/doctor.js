const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    f_name: { type: String },
    l_name: { type: String }
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
  },
  location: { type: String },
  license: { type: String }, // Assuming the URL points to the picture of the license
  department: { type: String },
  degree: { type: String }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
