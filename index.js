const express = require('express');
const mongoose = require('mongoose');
const Patient = require('./models/patient');

const app = express();
const PORT = 5000;

const uri = 'mongodb://localhost:27017/EHR';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('teezk 7amra!');
});

app.get('/patients', async (req, res) => {
    patients = await Patient.find({});
    res.send(patients);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

