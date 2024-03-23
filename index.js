const patientRouter = require('./routers/patientRouters.js');
const doctorRouter = require('./routers/doctorRouters.js');
const userRouter = require('./routers/userRouters.js');

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db/mongo')
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('lol Rosheta!');
});

app.use('/', userRouter);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
