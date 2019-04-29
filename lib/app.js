const net = require('net');
const rl = require('readline');
const concat = require('concat-stream');
const messageDecoder = require('./utils/messageDecoder');
const songs = [];
const connectedClients = [];

// function broadcast(message) {
//   connectedClients.forEach(client => {
//     client.write()
//   });
// }

const server = net.createServer(client => {
  connectedClients.push(client);
  const decoder = messageDecoder();
  client.on('data', chunk => {
    const result = decoder(chunk.toString());
    if(!result) return;
    if(result) {
      console.log(result);
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
