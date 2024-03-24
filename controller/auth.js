const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const Patient = require('../models/patient');
const handleErrors = require('../utils/errorHandler')

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, phone, ssn, birthdate } = req.body;
      
      // Validate password before hashing
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ password: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character." });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new patient
      const newPatient = new Patient({ 
        email: { value: email }, 
        password: hashedPassword, 
        name: name,
        phone_number: { value: phone }, 
        ssn: { value: ssn },
        d_o_b: { value: birthdate },
      });

      await newPatient.save();

      res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
      // console.error(error);
      const e = handleErrors(error)
      res.status(500).json(e);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const patient = await Patient.findOne({ 'email.value': email });
      if (!patient) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: patient._id }, JWT_SECRET, { expiresIn:  JWT_EXPIRE});

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
