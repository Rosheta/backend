const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const authMiddleware = require('../middleware/auth');
const authController = require('./controllers/auth');
const profileController = require('./controllers/profile');
const chatController = require('./controllers/chats');

// Route for registering a new patient
router.post('/register', authController.register);

// Route for patient login
router.post('/login', authController.login);

// Route for getting patient profile
router.get('/profile', authMiddleware.authenticate, profileController.profile);

// Route for getting chats
router.get('/getChats' ,chatController.chats)

// Route for getting chat content
router.get('/getChatContent' ,chatController.chatContent)

// Route for starting chats
router.post('/startChat' ,chatController.startChat)
module.exports = router;
