const express = require('express');
const router = express.Router();

const controller = require('../controller/hlf' );
const hlfController= controller

// Routes for GET requests
router.get('/ch/all', hlfController.get.getAllMedicalRecords);
router.get('/ch/rec', hlfController.get.getMedicalRecord);
router.get('/ch/cd', hlfController.get.getAllCronicalDiseases);


// Routes for POST requests
router.post('/ch/rec', hlfController.post.createMedicalRecord);
router.post('/ch/upd', hlfController.post.updateMedicalRecord);



// Route for DELETE request
router.delete('/ch/rec', hlfController.delete.DeleteMedicalRecord);
// Route for PU

module.exports = router;
