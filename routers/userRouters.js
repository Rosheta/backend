const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const authMiddleware = require('../middleware/auth');

// Route for registering a new patient/doctor
router.post('/register', authController.register);

// Route for patient/doctor login
router.post('/login', authController.login);

// Route for getting patient/doctor profile
router.get('/profile', authMiddleware.authenticate, profileController.profile);

module.exports = router;