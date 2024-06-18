const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isLength, isNumeric, isStrongPassword } = require('validator')

const governmentSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: [true, "you must enter a lab name"]
  },
  phone_number: {
      type: String,
      unique: [true, "phone number is already used"],
      validate: [v => isLength(v, { min: 11, max: 11 }) && isNumeric(v), `not a valid phone number. Must be exactly 11 digits.`],
      required: [true, "you must enter a phone number"]
  },
  email: {
      type: String,
      unique: [true, "email is already used"],
      validate: [isEmail, 'not a valid email'],
      required: [true, "you must enter your email"]
  },
  password: {
    type: String,
    required: [true, "you must enter a password"],
    validate: [isStrongPassword, 'not strong enough password'],
  },
  profile_picture: {
    type: String,
    default: null
  },
  username: {
    type: String,
    unique: [true, "username is already used"],
  },
  location: {
    type: String,
    required: [true, "you must enter a location"],
  }
});
// hash password and add username before saving
governmentSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);

  this.username = this.email.value.split('@')[0];
  let usernameExists = await this.constructor.findOne({ username: this.username });

  let nonce = 1;
  while (usernameExists) {
    this.username = `${this.username}_${nonce}`;
    nonce++;
    usernameExists = await this.constructor.findOne({ username: this.username });
  }
  next();
});
const Government = mongoose.model('Government', governmentSchema);

module.exports = Government;
