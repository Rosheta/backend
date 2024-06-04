const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Lab = require('../models/lab');
const Government = require('../models/government');
const Firebase = require('../models/firebase');

const handleErrors = require('../utils/errorHandler')
const hlf = require('../HLF/contractServices');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

const authController = {
  register_patient: async (req, res) => {
    try {
      const { email, password, name, phone, ssn, birthdate, gender } = req.body;
      
      // Create a new patient
      const newPatient = new Patient({ 
        email: { value: email }, 
        password: password, 
        name: name,
        phone_number: { value: phone }, 
        ssn: ssn,
        birthdate: { value: birthdate },
        gender: gender
      });

      await newPatient.save();

      res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
      // console.error(error);
      const e = handleErrors(error)
      res.status(500).json(e);
    }
  },

  register_doctor: async (req, res) => {
    try {
      const { email, password, name, phone, ssn, birthdate, gender, location, government, department } = req.body;

      // Create a new doctor
      const newDoctor = new Doctor({ 
        email: { value: email }, 
        password: password, 
        name: name,
        phone_number: { value: phone }, 
        ssn: ssn,
        birthdate: { value: birthdate },
        gender: gender,
        location : location,
        government: government,
        department: department,
        license: req.file.path
      });

      await newDoctor.save();

      res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
      // console.error(error);
      const e = handleErrors(error)
      res.status(500).json(e);
    }
  },
  register_lab: async (req, res) => {
    try {
      const { email, password, name, phone, location, government } = req.body;
      
      // Create a new Lab
      const newLab = new Lab({ 
        email: { value: email }, 
        password: password, 
        name: name,
        phone_number: { value: phone }, 
        location : location,
        government: government,
        license: req.file.path
      });

      await newLab.save();

      res.status(201).json({ message: 'Lab registered successfully' });
    } catch (error) {
      // console.error(error);
      const e = handleErrors(error)
      res.status(500).json(e);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password, devicetoken } = req.body;


      let user = await Patient.findOne({ 'email.value': email });
      let type = "p"

      if (!user) {
        user = await Doctor.findOne({ 'email.value': email });
        type = "d"
      }

      if (!user) {
        user = await Lab.findOne({ 'email.value': email });
        type = "l"
      }

      if (!user) {
        user = await Government.findOne({ 'email.value': email });
        type = "g"
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id, type: type }, JWT_SECRET, { expiresIn:  JWT_EXPIRE});
      
      if(type == 'd'){
        const data = await hlf.EnrollDoctor(user.username, user.blockchain_pass); 
        console.log(data);
      }
      else if(type == 'p'){
        const data = await hlf.EnrollPatient(user.username, user.blockchain_pass); 
        console.log(data);
      }
      // Check if the username already exists in the database
      const existingUser = await Firebase.findOne({ username: user.username });

      if (existingUser) {
          // Username already exists, update the token
          existingUser.token = devicetoken;
          await existingUser.save();
      } else {
          // Username doesn't exist, create a new entry
          const newUserToken = new Firebase({
              username: user.username,
              token: devicetoken
          });
          await newUserToken.save();
      }

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getUser: async (req, res) => {
    try {
      const username = req.query.username;

      let user = await Doctor.findOne({ 'username': username });

      if(!user)
        return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({
        name: user.name,
        image: user.profile_picture,
      });
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
