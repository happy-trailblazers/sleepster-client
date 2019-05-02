const Song = require('../models/Song');
const connectedClients = require('../databases/clientlist');

async function broadcast(message, code) {
  console.log(connectedClients.length, 'BROAD_CAST');
  connectedClients.forEach(client => {
    client.write(`!${code}!${message}%${code}%`);
  });
}

async function songLookup(songId, client) {
  if(songId === '&goBack&') {
    const masterSongList = await Song.find().lean();
    const notFoundPackage = {
      notFound: true,
      masterSongList
    };
    client.write(`!11!${JSON.stringify(notFoundPackage)}%11%`);
    return;
  }
  const foundSong = await Song.findById(songId).lean();
  
  console.log('NO SONG!', foundSong);
  if(!foundSong) {
    const masterSongList = await Song.find().lean();
    const notFoundPackage = {
      notFound: true,
      masterSongList
    };
    client.write(`!11!${JSON.stringify(notFoundPackage)}%11%`);
    return;
  } else {
    const { url, title, songPath } = foundSong;
    const confirmation = { url, songTitle: title, songPath };
    client.write(`!12!${JSON.stringify(confirmation)}%12%`);
    return;
  }
}

async function deleteFromSongList(client) {
  await Song.deleteMany({ url: client.url });
  return;
}

function deleteFromClientList(client) {
  for(let i = 0; i < connectedClients.length; i++) {
    if(connectedClients[i] === client) {
      connectedClients.splice(i, 1);
      break;
    }
  }
}

module.exports = {
  broadcast,
  songLookup,
  deleteFromSongList,
  deleteFromClientList
};
