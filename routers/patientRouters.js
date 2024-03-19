const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth');
const profileController = require('./controllers/profile');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for user login
router.post('/get', profileController.profile);

module.exports = router;
