const patientRouter = require('./routers/patientRouters.js');
const doctorRouter = require('./routers/doctorRouters.js');
const labRouter = require('./routers/labRouters.js');
const userRouter = require('./routers/userRouters.js');
const hlfRouter = require('./routers/hlfRouters.js');
const ipfsRouter = require('./routers/ipfsRouters.js');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const chatsController = require('./controller/chats');
const searchController = require('./controller/search');

const db = require('./db/mongo')

const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');


dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors());

const io = socketIo(server)
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(' Welcome to Rosheta!');
});

app.use('/images',express.static(__dirname + '/images'));

app.use('/', userRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/lab', labRouter);
app.use('/hlf', hlfRouter);
app.use('/ipfs', ipfsRouter);

// get all identities
app.get('/patients', async (req, res) => {
  const data = await testHlf.getAllPatients();
  res.send(data);
});
// get all doctors
app.get('/doctors', async (req, res) => {
  const data = await testHlf.getAllDoctors();
  res.send(data);
});
// register a patient
app.post('/registerPatient', async (req, res) => {
  const data = await testHlf.RegisterPatient(req.body.patient);
  res.send(data);
});
// register a doctor
app.post('/registerDoctor', async (req, res) => {
  const data = await testHlf.RegisterDoctor(req.body.doctor);
  res.send(data);
});
// enroll a patient
app.post('/enrollPatient', async (req, res) => {
  const data = await testHlf.EnrollPatient(req.body.patient, req.body.pass);
  res.send(data);
});
// enroll a doctor
app.post('/enrollDoctor', async (req, res) => {
  const data = await testHlf.EnrollDoctor(req.body.doctor, req.body.pass);
  res.send(data);
});
// get all medical records
app.get('/medicalRecords', async (req, res) => {
  const data = await testHlf.getChronicDieases(req.body.patient,req.body.signer);
  res.send(data);
});


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