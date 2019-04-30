const connectedClients = require('../databases/clientlist');
const masterSongList = require('../databases/songlist');


function broadcast(message, code) {
  connectedClients.forEach(client => {
    client.write(`!${code}!${message}%${code}%`);
  });
}

function songLookup(songTitle, client) {
  for(let i = 0; i < masterSongList.length; i++) {
    if(masterSongList[i].song === songTitle) {
      const ip = masterSongList[i].ip;
      const confirmation = { ip, songTitle };
      client.write(`!12!${JSON.stringify(confirmation)}%12%`);
      return;
    }
  } 
  client.write('!12!Not Found%12%');
  return;
}

function deleteFromSongList(client) {
  for(let i = 0; i < masterSongList.length; i++) {
    if(masterSongList[i].ip === client.remoteAddress) {
      masterSongList.splice(i, 1);
      i--;
    }
  }
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
