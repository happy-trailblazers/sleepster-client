const net = require('net');
const { messageDecoder } = require('./utils/messageDecoder');
const { deleteFromClientList, deleteFromSongList } = require('./utils/serverTools');
const connectedClients = require('./databases/clientlist');
const switchBoard = require('./utils/switchBoard');

const server = net.createServer(client => {
  connectedClients.push(client);
  console.log('Client Connected, Current Clients: ', connectedClients.length);
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
    console.log('Client Disconnected, Current Clients: ', connectedClients.length);
  });
});

module.exports = server;
