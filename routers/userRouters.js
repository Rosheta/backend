const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const profileController = require('../controller/profile');
const chatController = require('../controller/chats');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
    filename: function (req, file, cb) {
        const name = req.user.replace(/\s+/g, '_');
        const filename = name + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename)
  }
})

// Route for patient/doctor login
router.post('/login', authController.login);

// Route for getting patient/doctor profile
router.get('/profile', authMiddleware.authenticate, profileController.getMyProfile);

router.put('/profile', authMiddleware.authenticate, profileController.updateProfile);

router.get('/profileByID', authMiddleware.authenticate, profileController.getProfile);

const upload = multer({ storage: storage })
router.put('/profile/picture', authMiddleware.authenticate, upload.single('photo'), profileController.updateProfilePicture);

// Route for getting chats
router.get('/getChats' , authMiddleware.authenticate,chatController.chats)

// Route for getting chat content
router.get('/getChatContent' , authMiddleware.authenticate,chatController.chatContent)

// Route for starting chats
router.post('/startChat' , authMiddleware.authenticate,chatController.startChat)

module.exports = router;