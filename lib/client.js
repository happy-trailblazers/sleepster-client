const net = require('net');
const fs = require('fs');
const ngrok = require('ngrok');
const { messageDecoder } = require('./utils/messageDecoder');
const clientSwitchBoards = require('./utils/clientSwitchBoards');
// const pathOptions  = require('./utils/PATH');
const firstQuestions = require('./inquirer/welcome');
const readMusicDirectory = require('./utils/readMusicDirectory');

const client = net.createConnection(54321, '18.219.224.129', async() => {
  const pathOptions = await firstQuestions();
  client.savePath = pathOptions.savePath;
  console.log(pathOptions);
  let url = null;
  try {
    url = await ngrok.connect({
      proto: 'tcp',
      port: 8080
    });
  } catch(err){
    console.log(err);
    await ngrok.disconnect();
  }
    
  if(pathOptions.customSharedPath) {
    fs.readdir(pathOptions.customSharedPath, (err, rawFiles) => {
      const files = rawFiles.map(file => {
        return { title: file, songPath: `${pathOptions.customSharedPath}/${file}`, artist: 'Unknown Artist', album: 'Unknown Album' };
      });
      client.write(`!01!${JSON.stringify({ files, url })}%01%`);
    });
  }
    
  else {
    const files = await readMusicDirectory(pathOptions.userName);
    console.log('SONG_ARRAY', files.length);
    client.write(`!01!${JSON.stringify({ files, url })}%01%`);
  }
    
    
  const clientServer = net.createServer(downloadClient => {
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
