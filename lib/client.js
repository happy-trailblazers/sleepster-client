const net = require('net');
const fs = require('fs');
const fsPromise = require('fs').promises;
const ngrok = require('ngrok');
const figlet = require('figlet');
const { messageDecoder } = require('./utils/messageDecoder');
const clientSwitchBoards = require('./utils/clientSwitchBoards');
const firstQuestions = require('./inquirer/welcome');
const readMusicDirectory = require('./utils/readMusicDirectory');

const client = net.createConnection(54321, '18.219.224.129', async() => {
  const pathOptions = await firstQuestions();
  
  try {
    await fsPromise.access(pathOptions.savePath);
    if(pathOptions.userName) {
      await fsPromise.access(`/Users/${pathOptions.userName}/Music/iTunes/iTunes Media/Music`);
    } else {
      await fsPromise.access(pathOptions.customSharedPath);
    }
  } catch(err){
    console.log(err);
    process.exit();
  }

  client.savePath = pathOptions.savePath;
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
    client.write(`!01!${JSON.stringify({ files, url })}%01%`);
  }
    
  const clientServer = net.createServer(downloadClient => {
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
