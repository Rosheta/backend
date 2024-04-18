const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

// Route for registering a new patient/doctor
router.post('/register', authController.register_patient);

module.exports = router;