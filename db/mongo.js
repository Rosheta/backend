const mongoose = require('mongoose');

const DATABASE_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/rosheta';

mongoose.connect(DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.catch((err) => {
  console.log("Mongoose Error: " + err);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

module.exports = db;
