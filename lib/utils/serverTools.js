const net = require('net');
const Song = require('../models/Song');
const User = require('../models/User');

async function broadcast(message, code) {
  const users = await User.find(); 
  for(let i = 0; i < users.length; i++) {
    new net.Socket({ fd: users[i].fd })
      .then(client => {
        console.log(client);
      });
    // client.write(`!${code}!${message}%${code}%`);
  }
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
