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


  // rl.prompt();
  
  // rl.on('line', line => {
  //   rl.prompt();
  // });
});

const decoder = messageDecoder();
client.on('data', chunk => {
  const result = decoder(chunk.toString());
  if(!result) return;
  if(result) {
    const messageDetails = messageExtractor(result);
    
    switch(messageDetails.messageCode) {
      case '11': 
        console.log('current MSL', JSON.parse(messageDetails.message));
        rl.question('Choose a song from the MSL\n💿: ', answer => {
          client.write(`!02!${answer}%02%`);
        });
        break;
    
      default:
        break;
    }
  }
});
