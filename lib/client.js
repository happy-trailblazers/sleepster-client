const net = require('net');
const fs = require('fs');
const { messageDecoder, messageExtractor } = require('./utils/messageDecoder');

const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir('/Users/meganmarshall/projects/career-track/week-1/functions', (err, files) => {
    client.write(`!01!${JSON.stringify(files)}%01%`);
  });
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
        
        break;
    
      default:
        break;
    }
  }
});
