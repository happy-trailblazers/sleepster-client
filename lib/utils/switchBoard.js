const masterSongList = require('../databases/songlist');
const { messageExtractor } = require('./messageDecoder');
const { broadcast, songLookup } = require('./serverTools');

function switchBoard(result, client) {
  const messageDetails = messageExtractor(result);
  switch(messageDetails.messageCode) {
    case '01': {
      const { files, url } = JSON.parse(messageDetails.message);
      console.log(files);
      files.forEach(song => {
        const songEntry = {
          ip: client.remoteAddress,
          url,
          song
        };
        masterSongList.push(songEntry);
      });
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
