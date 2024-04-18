const express = require('express');
const router = express.Router();

const hlf = require('../HLF/contractServices');

router.get('/', async (req, res) => {
  console.log('req.body', req.body);
  const data = await hlf.getAllMedicalRecords();
  res.send(data);
});

// create a new record
router.get('/rec', async (req, res) => {
  const { id, patientName, dob, diagnosis, medications, allergies, doctor } = req.body;
  const data = await hlf.CreateMedicalRecord(id, patientName, dob, diagnosis, medications, allergies, doctor);
  res.send(data);
});

module.exports = router;