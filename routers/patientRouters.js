const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const authMiddleware = require('../middleware/auth');
const chatController = require('../controllers/chats');

// Route for registering a new patient
router.post('/register', authController.register);

// Route for patient login
router.post('/login', authController.login);

// Route for getting patient profile
router.get('/profile', authMiddleware.authenticate, profileController.profile);


module.exports = router;
