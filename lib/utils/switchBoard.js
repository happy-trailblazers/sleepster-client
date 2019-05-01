const User = require('../models/User');
const Song = require('../models/Song');
const { messageExtractor } = require('./messageDecoder');
const { broadcast, songLookup } = require('./serverTools');

async function switchBoard(result, client) {
  const messageDetails = messageExtractor(result);
  switch(messageDetails.messageCode) {
    case '01': {
      const { files, url } = JSON.parse(messageDetails.message);
      const createdUser = await User.create({
        url,
        ip: client.remoteAddress
      });
      for(let i = 0; i < files.length; i++) {
        await Song.create({
          title: files[i],
          user: createdUser._id
        });
      }
   
      const masterSongList = await Song.find({}, 'title');
      console.log(masterSongList);
      broadcast(JSON.stringify(masterSongList), '11');
      break;
    }
    case '02': {
      const songTitle = messageDetails.message;
      songLookup(songTitle, client);
      break;
    }
    default:
      break;
  }
}

module.exports = switchBoard;
