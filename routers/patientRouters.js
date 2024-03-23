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
router.get('/getChats' ,chatController.chats)

// Route for getting chat content
router.get('/getChatContent' ,chatController.chatContent)

// Route for starting chats
router.post('/startChat' ,chatController.startChat)
module.exports = router;
