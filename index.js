const patientRouter = require('./routers/patientRouters.js');
const doctorRouter = require('./routers/doctorRouters.js');
const userRouter = require('./routers/userRouters.js');
const hlfRouter = require('./routers/hlfRouters.js');
const ipfsRouter = require('./routers/ipfsRouters.js');


const express = require('express');
const bodyParser = require('body-parser');

const chatsController = require('./controller/chats');
const db = require('./db/mongo')
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');


dotenv.config();
const app = express();
const server = http.createServer(app);

const io = socketIo(server)
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});


app.use('/', userRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/hlf', hlfRouter);
app.use('/ipfs', ipfsRouter);

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