const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: 'Unknown Album'
  },
  artist: {
    type: String,
    default: 'Unknown Artist'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Song', songSchema);
