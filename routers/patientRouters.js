const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const fileController = require('../controller/file');
const hlfcontroller = require('../controller/hlf' );
const remoteAccessController = require('../controller/remoteAccess');

const authMiddleware = require('../middleware/auth');
const accessControlMiddleware = require('../middleware/access');

const pushNotificationsController = require('../controller/push_notifications');

router.post('/register', authController.register_patient);
router.post('/giveAccess' , authMiddleware.authenticate , pushNotificationsController.giveAccess);

// get routers
router.get('/getFiles', authMiddleware.authenticate,fileController.getUserFiles);
router.get('/appointments',
    authMiddleware.authenticate,
    accessControlMiddleware.accessControl,
    hlfcontroller.get.getAllAppointments);

router.get('/diseases',
    authMiddleware.authenticate,
    accessControlMiddleware.accessControl,
    hlfcontroller.get.getAllCronicalDiseases);

router.get('/data',
  authMiddleware.authenticate,
  accessControlMiddleware.accessControl,
  remoteAccessController.getAllPatientData
);

router.get('/show', authMiddleware.authenticate, fileController.showFile);


router.delete('/deleteFile', authMiddleware.authenticate,fileController.deleteFile);

module.exports = router;