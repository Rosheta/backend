const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const accessControlMiddleware = require('../middleware/access');
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

// get routers
router.get('/getAllPatientData',
  authMiddleware.authenticate,
  accessControlMiddleware.accessControl,
  remoteAccessController.getAllPatientData
);
router.get('/getFile' , authMiddleware.authenticate , remoteAccessController.getFile);

// post routers
router.post('/appointment',
  authMiddleware.authenticate,
  accessControlMiddleware.accessControl,
  remoteAccessController.addAppointment
);
router.post('/register', upload.single('file'), authController.register_doctor);

module.exports = router;
