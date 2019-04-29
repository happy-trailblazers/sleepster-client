const net = require('net');
const rl = require('readline');
const songs = [];


const server = net.createServer(client => {
  console.log(client.address());
  client.on('data', data => {
    if(data.toString().startsWith('!01')) {
      songs.push({
        ip: client.remoteAddress,
        song: data.toString().slice(3)
      });
    }

    console.log(songs);
  });
});


module.exports = server;
