const net = require('net');
const User = require('./models/User');
const { messageDecoder } = require('./utils/messageDecoder');
const { deleteFromClientList, deleteFromSongList, broadcast } = require('./utils/serverTools');
const masterSongList = require('./databases/songlist');
const connectedClients = require('./databases/clientlist');
const switchBoard = require('./utils/switchBoard');

const server = net.createServer(client => {
  console.log('client connected');
  connectedClients.push(client);
  const decoder = messageDecoder();
  client.on('data', chunk => {
    const result = decoder(chunk.toString());
    if(!result) return;
    if(result) {
      switchBoard(result, client);
    }
  });
  client.on('close', () => {
    deleteFromClientList(client);
    deleteFromSongList(client);
    broadcast(JSON.stringify(masterSongList), '11');
  });
});

module.exports = server;
