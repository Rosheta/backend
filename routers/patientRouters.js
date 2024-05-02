const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const fileController = require('../controller/file');
const authMiddleware = require('../middleware/auth');
const pushNotificationsController = require('../controller/push_notifications');

// Route for registering a new patient/doctor
router.post('/register', authController.register_patient);

router.get('/getFiles', authMiddleware.authenticate,fileController.getUserFiles);

router.delete('/deleteFile', authMiddleware.authenticate,fileController.deleteFile);

router.get('/show', authMiddleware.authenticate, fileController.showFile);

// Route for send notifications to doctor
router.post('/giveAccess' , pushNotificationsController.giveAccess);
// router.post('/giveAccess' , authMiddleware.authenticate , remoteAccessController.generateToken);

module.exports = router;