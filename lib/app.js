const net = require('net');
const { messageDecoder, messageExtractor } = require('./utils/messageDecoder');
const masterSongList = [];
const connectedClients = [];

function broadcast(message, code) {
  connectedClients.forEach(client => {
    client.write(`!${code}!${message}%${code}%`);
  });
}

const server = net.createServer(client => {
  console.log('client connected');
  connectedClients.push(client);
  const decoder = messageDecoder();
  client.on('data', chunk => {
    const result = decoder(chunk.toString());
    if(!result) return;
    if(result) {
      const messageDetails = messageExtractor(result);
      switch(messageDetails.messageCode) {
        case '01': {
          const clientSongList = JSON.parse(messageDetails.message);
          clientSongList.forEach(song => {
            const songEntry = {
              ip: client.remoteAddress,
              song
            };
            masterSongList.push(songEntry);
          });
          broadcast(JSON.stringify(masterSongList), '11');
          break;
        }
        default:
          break;
      }
    }
  });
});


module.exports = server;
