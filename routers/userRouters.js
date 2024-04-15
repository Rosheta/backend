const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const chatController = require('../controller/chats');
const searchController = require('../controller/search');
const authMiddleware = require('../middleware/auth');

// Route for registering a new patient/doctor
router.post('/register', authController.register);

// Route for patient/doctor login
router.post('/login', authController.login);

// Route for getting patient/doctor profile
router.get('/profile', authMiddleware.authenticate, profileController.profile);

// Route for getting chats
router.get('/getChats' , authMiddleware.authenticate,chatController.chats)

// Route for getting chat content
router.get('/getChatContent' , authMiddleware.authenticate,chatController.chatContent)

// Route for starting chats
router.post('/startChat' , authMiddleware.authenticate,chatController.startChat)

// Route for search
router.post('/search' , searchController.search)

module.exports = router;