// const patientRouter = require('./routers/patientRouters.js');
// const doctorRouter = require('./routers/doctorRouters.js');
const userRouter = require('./routers/userRouters.js');

const express = require('express');
const bodyParser = require('body-parser');

const Patient = require('./models/patient');
const authController = require('./controller/auth');
const profileController = require('./controller/profile');
const chatsController = require('./controller/chats');
const searchController = require('./controller/search');

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

app.use('/', userRouter);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (data) => {
      console.log('Message received:', data);
      senderId = data.senderId;
      chatId = data.chatId;
      message = data.message;
      receiverId =await chatsController.getReceiverId(chatId , senderId);
      await chatsController.saveMessage(senderId, receiverId, chatId, message);
    
      io.emit(`${chatId}`, {
          sender: senderId,
          message: message,
          time: new Date(), 
          isSeen: false
      });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});