const Song = require('../models/Song');
const { messageExtractor } = require('./messageDecoder');
const { broadcast, songLookup } = require('./serverTools');

async function switchBoard(result, client) {
  const messageDetails = messageExtractor(result);
  switch(messageDetails.messageCode) {
    case '01': {
      const { files, url } = JSON.parse(messageDetails.message);
      client.url = url;
      console.log('FILES_ZERO:', files[0]);
      for(let i = 0; i < files.length; i++) {
        const {
          songPath,
          title,
          album,
          artist
        } = files[i];
        await Song.create({ 
          songPath,
          title,
          album,
          artist,
          url
        });
      }
      const masterSongList = await Song.find().lean();
      console.log('MSL PRE WRITE', masterSongList.length);
      client.write(`!11!${JSON.stringify(masterSongList)}%11%`);
      // console.log(masterSongList);
      // await broadcast(JSON.stringify(masterSongList), '11');
      break;
    }
    case '02': {
      const songId = messageDetails.message;
      songLookup(songId, client);
      break;
    }
    default:
      break;
  }
}

module.exports = switchBoard;
