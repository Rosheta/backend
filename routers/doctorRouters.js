const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const authMiddleware = require('../middleware/auth');

// Route for registering a new doctor
router.post('/register', authController.register);

// Route for doctor login
router.post('/login', authController.login);

// Route for getting doctor profile
router.get('/profile', authMiddleware.authenticate, profileController.profile);

module.exports = router;