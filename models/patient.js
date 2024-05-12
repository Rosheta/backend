const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isLength, isNumeric, isStrongPassword } = require('validator');
const { type } = require('os');
const HLF = require('../HLF/contractServices');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: [true, "you must enter your name"]
  },
  phone_number: {
    value: {
      type: String,
      unique: [true, "phone number is already used"],
      validate: [v => isLength(v, { min: 11, max: 11 }) && isNumeric(v), `not a valid phone number. Must be exactly 11 digits.`],
      required: [true, "you must enter a phone number"]
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  ssn: {
      type: String,
      unique: [true, "SSN is already used"],
      validate: [v => isLength(v, { min: 14, max: 14 }) && isNumeric(v), `not a valid SSN. Must be exactly 14 digits.`]
  },
  email: {
    value: {
      type: String,
      unique: [true, "email is already used"],
      validate: [isEmail, 'not a valid email'],
      required: [true, "you must enter your email"]
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  password: {
    type: String,
    required: [true, "you must enter a password"],
    validate: [isStrongPassword, 'not strong enough password'],
  },
  birthdate:{
    value: {
      type: [Date, "not a valid date type"],
      required: [true, "you must enter your birth date"]
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  gender: {
    type: String,
    enum: ['m', 'f'],
    required: [true, "you must enter your gender"]
  },
  profile_picture: {
    type: String,
    default: null
  },
  username: {
    type: String,
    unique: [true, "username is already used"],
  },
  blockchain_pass: {
    type: String,
  }
});
// hash password and add username before saving
patientSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);

  this.username = this.email.value.split('@')[0];
  let usernameExists = await this.constructor.findOne({ username: this.username });

  let nonce = 1;
  while (usernameExists) {
    this.username = `${this.username}_${nonce}`;
    nonce++;
    usernameExists = await this.constructor.findOne({ username: this.username });
  }
  const data = await HLF.RegisterUser(this.username);
  this.blockchain_pass = data.secret;
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
