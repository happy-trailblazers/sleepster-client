const net = require('net');
const { messageDecoder } = require('./utils/messageDecoder');
const { deleteFromClientList, deleteFromSongList, broadcast } = require('./utils/serverTools');
const connectedClients = require('./databases/clientlist');
// const Song = require('./models/Song');
const switchBoard = require('./utils/switchBoard');

const server = net.createServer(client => {
  console.log('Client Connected', connectedClients.length);
  connectedClients.push(client);
  const decoder = messageDecoder();
  client.on('data', chunk => {
    const result = decoder(chunk.toString());
    if(!result) return;
    if(result) {
      switchBoard(result, client);
    }
  });
  client.on('close', async() => {
    await deleteFromClientList(client);
    await deleteFromSongList(client);
    console.log('Client Disconnected', connectedClients.length);
  });
});

module.exports = server;
