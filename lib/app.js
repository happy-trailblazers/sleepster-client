const net = require('net');
const rl = require('readline');
const concat = require('concat-stream');
const messageDecoder = require('./utils/messageDecoder');
const masterSongList = [];
const connectedClients = [];

function broadcast(message, code) {
  connectedClients.forEach(client => {
    client.write(`!${code}!${message}%${code}%`);
  });
}

const server = net.createServer(client => {
  connectedClients.push(client);
  const decoder = messageDecoder();
  client.on('data', chunk => {
    const result = decoder(chunk.toString());
    if(!result) return;
    if(result) {
      // console.log(result);
      const messageCode = result.slice(1, 3);
      // console.log(messageCode);
      const message = result.substring(4, result.length - 4);
      // console.log(message);
      switch(messageCode) {
        case '01': {
          const clientSongList = JSON.parse(message);
          clientSongList.forEach(song => {
            const songEntry = {
              ip: client.remoteAddress,
              song
            };
            masterSongList.push(songEntry);
          });
          broadcast(masterSongList, 2);
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
