const express = require('express');
const bodyParser = require('body-parser');
const Patient = require('./models/patient');
const authController = require('./controller/auth');
const profileController = require('./controller/profile');
const chatsController = require('./controller/chats');
const db = require('./db/mongo')
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = socketIo(server)
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});

app.post('/register', authController.register);

app.post('/login', authController.login);

app.get('/profile', profileController.profile);

app.get('/getChats', chatsController.chats);

app.post('/getChatContent', chatsController.chatContent);

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

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (data) => {
      console.log('Message received:', data);
      // const { senderId, chatId, message } = data;
      senderId = data.senderId;
      chatId = data.chatId;
      message = data.message;
      receiverId =await chatsController.getReceiverId(chatId , senderId);
      await chatsController.saveMessage(senderId, receiverId, chatId, message);
    
      io.emit(`${chatId}`, {
          sender: senderId,
          message: message,
          time: new Date(), // Use current time
          isSeen: false
      });
  });
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});