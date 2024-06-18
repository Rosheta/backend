const express = require('express');
const router = express.Router();

const controller = require('../controller/hlf' );
const hlfController= controller

// Routes for GET requests
router.get('/ch/all', hlfController.get.getAllMedicalRecords);
router.get('/ch/rec', hlfController.get.getMedicalRecord);
// router.get('/ch/cd', hlfController.get.getAllCronicalDiseases);
router.get('/ch/users', hlfController.get.getAllUsers);
// router.get('/ch/ap', hlfController.get.getAllAppointments);
router.get('/ch/data', hlfController.get.getAllData);


// Routes for POST requests
router.post('/ch/rec', hlfController.post.createMedicalRecord);
router.post('/ch/upd', hlfController.post.updateMedicalRecord);

router.post('/ch/ru', hlfController.post.RegisterUser);
router.post('/ch/ed', hlfController.post.enrollDoctor);
router.post('/ch/ep', hlfController.post.enrollPatient);



// Route for DELETE request
router.delete('/ch/rec', hlfController.delete.DeleteMedicalRecord);
router.delete('/ch/all', hlfController.delete.DeleteAllMedicalRecords);
module.exports = router;
