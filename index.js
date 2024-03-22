const express = require('express');
const bodyParser = require('body-parser');
const Patient = require('./models/patient');
const authController = require('./controller/auth');
const profileController = require('./controller/profile');
const chatsController = require('./controller/chats');
const db = require('./db/mongo')
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});

app.post('/register', authController.register);

app.post('/login', authController.login);

app.get('/profile', profileController.profile);

app.get('/getChats', chatsController.chats);

app.get('/getChatContent', chatsController.chatContent);

app.post('/startChat', chatsController.startChat);

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
