const net = require('net');
const fs = require('fs');
const { messageDecoder } = require('./utils/messageDecoder');
const clientSwitchBoards = require('./utils/clientSwitchBoards');
const PATH = require('./utils/PATH');

const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir(PATH, (err, files) => {
    client.write(`!01!${JSON.stringify(files)}%01%`);
  });

  const clientServer = net.createServer(downloadClient => {
    // downloadClient.on('end', () => {
    //   console.log('sent file');
    // });
    console.log('Download client connected');
    const downloadDecoder = messageDecoder();
    downloadClient.on('data', chunk => {
      const result = downloadDecoder(chunk.toString());
      if(!result) return;
      if(result) {
        clientSwitchBoards(result, client, downloadClient);
      }
    });
  });
  clientServer.listen(8080);
});

const decoder = messageDecoder();
client.on('data', chunk => {
  const result = decoder(chunk.toString());
  if(!result) return;
  if(result) {
    clientSwitchBoards(result, client);
  }
});
