const net = require('net');
const fs = require('fs');
const readline = require('readline');
const { messageDecoder, messageExtractor } = require('./utils/messageDecoder');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '💿: '
});

const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir('/Users/meganmarshall/projects/career-track/week-1/functions', (err, files) => {
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
    let songNameToDownload = null;
    switch(messageDetails.messageCode) {
      case '11': 
        console.log('current MSL', JSON.parse(messageDetails.message));
        rl.question('Choose a song from the MSL\n💿: ', answer => {
          songNameToDownload = answer;
          client.write(`!02!${answer}%02%`);
        });
        break;
      case '12':
        // console.log('***', messageDetails.message);
        if(messageDetails.message === 'Not Found') {
          rl.question('Song not found. Choose a song from the MSL\n💿: ', answer => {
            songNameToDownload = answer;
            client.write(`!02!${answer}%02%`);
          });
        } else {
          console.log('this is the ip', messageDetails.message);
          const downloadingClient = net.createConnection(8080, messageDetails.message, () => {
            downloadingClient.write(`!03!${songNameToDownload}%03%`);
          });
        }

        break;

      default:
        break;
    }
  }
});
