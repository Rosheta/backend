const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth');
const profileController = require('./controllers/profile');
const chatController = require('./controllers/chats');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for user login
router.post('/get', profileController.profile);

// Route for getting chats
router.post('/getChats' ,chatController.chats)

// Route for getting chats
router.post('/getChatContent' ,chatController.chatContent)
module.exports = router;
