const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const fileController = require('../controller/file');

// Route for registering a new patient/doctor
router.post('/register', authController.register_patient);

router.get('/getFiles', fileController.getUserFiles);


module.exports = router;