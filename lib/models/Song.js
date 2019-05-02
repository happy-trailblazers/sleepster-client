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
  url: {
    type: String,
    required: true
  },
  songPath: String
});

module.exports = mongoose.model('Song', songSchema);
