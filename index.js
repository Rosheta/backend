const express = require('express');
const bodyParser = require('body-parser');
const Patient = require('./models/patient');
const authController = require('./controller/AuthPatient');
const db = require('./db/mongo')

const app = express();
const PORT = 5000;



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});

app.post('/register', authController.register);

app.post('/login', authController.login);

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
