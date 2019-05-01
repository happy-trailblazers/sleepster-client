const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  client: {
    type: Object,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
