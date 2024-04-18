const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

// Route for registering a new doctor
router.post('/register', authController.register_doctor);

module.exports = router;