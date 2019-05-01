require('dotenv').config();
const app = require('./lib/app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
app.listen(54321, () => {
  console.log('You are listening to smooooth jazz on `54321`');
  mongoose.connection.dropDatabase();
});

