const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const remoteAccessController = require('../controller/remoteAccess');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'doctors_licenses/')
  },
    filename: function (req, file, cb) {
        const name = req.body.name.replace(/\s+/g, '_');
        const filename = name + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename)
  }
})

const upload = multer({ storage: storage })

// Route for registering a new doctor
router.post('/register', upload.single('file'), authController.register_doctor);

// Route for get all the files of the patient to the doctor
router.post('/getFiles', authMiddleware.authenticate, remoteAccessController.getFiles);

// Route for fetch data of the patient
router.get('/getFile' , authMiddleware.authenticate , remoteAccessController.getFile);

module.exports = router;
