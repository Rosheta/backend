// const patientRouter = require('./routers/patientRouters.js');
// const doctorRouter = require('./routers/doctorRouters.js');
const userRouter = require('./routers/userRouters.js');

const express = require('express');
const bodyParser = require('body-parser');

// const Patient = require('./models/patient');
// const authController = require('./controller/auth');
// const profileController = require('./controller/profile');
// const chatsController = require('./controller/chats');
// const db = require('./db/mongo')
const dotenv = require('dotenv');
const http = require('http');
// const socketIo = require('socket.io');
const hlf = require('./HLF/contractServices');
const ipfsService = require('./HLF/ipfsService');

dotenv.config();
const app = express();
const server = http.createServer(app);

// const io = socketIo(server)
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});
app.get('/hlf', async (req, res) => {
  console.log('req.body', req.body);
  const data = await hlf.getAllMedicalRecords();
  res.send(data);
});
// create a new record
app.get('/hlf/rec', async (req, res) => {
  const { id, patientName, dob, diagnosis, medications, allergies, doctor } = req.body;
  const data = await hlf.CreateMedicalRecord(id, patientName, dob, diagnosis, medications, allergies, doctor);
  res.send(data);
});



const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the destination directory for file uploads

app.post('/ipfs/upload', upload.single('file'), async (req, res) => {
  const file = req.file; // Now, req.file contains the uploaded file information
  console.log('file', file);
  const data = await ipfsService.uploadFileToIPFS(file);
  res.send(data);
});
// get a file from IPFS
app.get('/ipfs/get', async (req, res) => {
  console.log('req.body', req);
  const hash = req.query.hash;
  const data = await ipfsService.getFileFromIPFS(hash);
  res.send(data);
});
app.get('/ipfs/all', async (req, res) => {
  const data = await ipfsService.getAllFilesFromIPFS();
  res.send(data);
 
});
app.get('/ipfs/delete', async (req, res) => {
  const hash = req.query.hash;
  const data = await ipfsService.deleteFileFromIPFS(hash);
  res.send(data);
} );
// app.use('/', userRouter);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('sendMessage', async (data) => {
//       console.log('Message received:', data);
//       senderId = data.senderId;
//       chatId = data.chatId;
//       message = data.message;
//       receiverId =await chatsController.getReceiverId(chatId , senderId);
//       await chatsController.saveMessage(senderId, receiverId, chatId, message);
    
//       io.emit(`${chatId}`, {
//           sender: senderId,
//           message: message,
//           time: new Date(), 
//           isSeen: false
//       });
//   });
// });

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});