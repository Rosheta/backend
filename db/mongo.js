const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let URI = null
if (process.env.NODE_ENV === "production"){
  URI = process.env.URI
}else if (process.env.NODE_ENV === "development") {
  URI = process.env.URI_DEV;
}

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'rosheta'
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
