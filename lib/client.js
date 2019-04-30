const net = require('net');
const fs = require('fs');
const readline = require('readline');
const { messageDecoder, messageExtractor } = require('./utils/messageDecoder');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '💿: '
});
const PATH = '/Users/meganmarshall/projects/career-track/week-1/functions';
const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir(PATH, (err, files) => {
    client.write(`!01!${JSON.stringify(files)}%01%`);
  });

  const clientServer = net.createServer(downloadClient => {
    const downloadDecoder = messageDecoder();
    downloadClient.on('data', chunk => {
      const result = downloadDecoder(chunk.toString());
      if(!result) return;
      if(result) {
        const messageDetails = messageExtractor(result);
        switch(messageDetails.messageCode) {
          case '03': {
            console.log('***', messageDetails.message);
            const fileRead = fs.createReadStream(`${PATH}/${messageDetails.message}`);
            fileRead.pipe(downloadClient);
            break;
          }
          default:
            break;
        }
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
    const messageDetails = messageExtractor(result);
    switch(messageDetails.messageCode) {
      case '11': {
        console.log('current MSL', JSON.parse(messageDetails.message));
        rl.question('Choose a song from the MSL\n💿: ', answer => {
          client.write(`!02!${answer}%02%`);
        });
        break;
      }
      case '12': {
        if(messageDetails.message === 'Not Found') {
          rl.question('Song not found. Choose a song from the MSL\n💿: ', answer => {
            client.write(`!02!${answer}%02%`);
          });
        } else {
          const { ip, songTitle } = JSON.parse(messageDetails.message);
          const downloadingClient = net.createConnection(8080, ip, () => {
            downloadingClient.write(`!03!${songTitle}%03%`);
          });
          const writeStream = fs.createWriteStream(`${PATH}/${songTitle}`);
          downloadingClient.pipe(writeStream);
        }

        break;
      }

      default:
        break;
    }
  }
});
