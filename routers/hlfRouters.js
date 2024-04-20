const express = require('express');
const router = express.Router();

const controller = require('../controller/hlf' );
const hlfController= controller

// Routes for GET requests
router.get('/ch/all', hlfController.get.getAllMedicalRecords);
router.get('/ipfs/get', hlfController.get.getFileFromIPFS);
router.get('/ipfs/all', hlfController.get.getAllFilesFromIPFS);

// Routes for POST requests
router.post('/ch/rec', hlfController.post.createMedicalRecord);
router.post('/ipfs/upload', hlfController.post.uploadFileToIPFS);

// Route for DELETE request
router.delete('/ipfs/delete', hlfController.delete.deleteFileFromIPFS);

module.exports = router;
