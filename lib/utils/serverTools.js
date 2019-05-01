const Song = require('../models/Song');
const connectedClients = require('../databases/clientlist');

async function broadcast(message, code) {
  connectedClients.forEach(client => {
    client.write(`!${code}!${message}%${code}%`);
  });
}

async function songLookup(songTitle, client) {
  const foundSong = await Song.findOne({ title: songTitle }).lean();
  const { url, title } = foundSong;
  const confirmation = { url, songTitle: title };

  if(foundSong) {
    client.write(`!12!${JSON.stringify(confirmation)}%12%`);
    return;
  } else {
    client.write('!12!Not Found%12%');
    return;
  }
}

async function deleteFromSongList(client) {
  await Song.deleteMany({ ip: client.remoteAddress });
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
