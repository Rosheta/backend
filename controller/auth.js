const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const Patient = require('../models/patient');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, phone, ssn, birthdate, type } = req.body;

      // Check if the email is already registered
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new patient
      console.log(email, password, name, phone, ssn, birthdate, type)
      const newPatient = new Patient({ 
        email: email, 
        password: hashedPassword, 
        name: name,
        phone_number: phone, 
        ssn: ssn,
        d_o_b: birthdate,
      });

      await newPatient.save();

      res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const patient = await Patient.findOne({ email });
      if (!patient) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: patient.email, id: patient._id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
