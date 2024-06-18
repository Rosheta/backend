const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const accessControlMiddleware = require('../middleware/access');
const remoteAccessController = require('../controller/remoteAccess');

const multer = require('multer');
const emergencyController = require('../controller/emergency');

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

router.get('/getFile' , 
    authMiddleware.authenticate ,
    accessControlMiddleware.accessControl,
    remoteAccessController.getFile);

router.get('/patient/data',
  authMiddleware.authenticate,
  accessControlMiddleware.accessControl,
  remoteAccessController.getAllPatientData
);

// post routers
router.post('/appointment',
  authMiddleware.authenticate,
  accessControlMiddleware.accessControl,
  remoteAccessController.addAppointment
);
router.post('/register', upload.single('file'), authController.register_doctor);

router.get('/emergency', authMiddleware.authenticate, emergencyController.getEmergencyToken);

module.exports = router;
