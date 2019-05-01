const net = require('net');
const Song = require('../models/Song');
const User = require('../models/User');

async function broadcast(message, code) {
  const connectedClients = await User.find(); 
  connectedClients.forEach(async(user) => {
    // create a new socket and add fd
    const client = await new net.Socket({ fd: user.fd });
    client.write(`!${code}!${message}%${code}%`);
  });
}

function songLookup(songTitle, client) {
  for(let i = 0; i < masterSongList.length; i++) {
    if(masterSongList[i].song === songTitle) {
      const url = masterSongList[i].url;
      const confirmation = { url, songTitle };
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
