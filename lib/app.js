const net = require('net');
const rl = require('readline');
const concat = require('concat-stream');
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
          console.log(masterSongList);
          broadcast(JSON.stringify(masterSongList), '11');
          break;
        }
        default:
          break;
      }
    }
    // if(result.startsWith('!01!')) {
    // body = chunk;
    // console.log(chunk.toString(), 'data');
    // const clientSongList = data.toString();
    // clientSongList.forEach(song => {
    //   songs.push({
    //     ip: client.remoteAddress,
    //     song: song.toString()
    //   });
      
    // });
    // }

    // console.log(songs, 'song list');
  });
});


module.exports = server;
