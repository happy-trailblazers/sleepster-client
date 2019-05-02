const net = require('net');
const fs = require('fs');
const { parse } = require('url');
const readline = require('readline');
const inquirer = require('inquirer');
const { messageExtractor } = require('./messageDecoder');
const PATH = require('./PATH');
const searchQuestions = require('../inquirer/search');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '💿: '
});


module.exports = async(result, client, downloadClient) => {
  const messageDetails = messageExtractor(result);
  console.log('MSG DTLS', messageDetails.messageCode);
  switch(messageDetails.messageCode) {
    case '11': {
      console.log('we received message from server');
      const answer = await searchQuestions(messageDetails.message);
      client.write(`!02!${answer}%02%`);
      break;
    }
    case '12': {
      if(messageDetails.message === 'Not Found') {
        rl.question('Song not found. Choose a song from the MSL\n💿: ', answer => {
          client.write(`!02!${answer}%02%`);
        });
      } else {
        const { url, songTitle } = JSON.parse(messageDetails.message);
        const { hostname, port } = parse(url);
        const downloadingClient = net.createConnection(port, hostname, () => {
          downloadingClient.write(`!03!${songTitle}%03%`);
        });
        const writeStream = fs.createWriteStream(`${PATH}/${songTitle}`);
        downloadingClient.pipe(writeStream);
        downloadingClient.on('end', () => {
          rl.question(`${songTitle} download complete.\nChoose another song from the MSL\n💿: `, answer => {
            client.write(`!02!${answer}%02%`);
          });
        });
      }
      break;
    }
    case '03': {
      const fileRead = fs.createReadStream(`${PATH}/${messageDetails.message}`);
      fileRead.pipe(downloadClient);
      fileRead.on('end', () => {
        rl.question(`${messageDetails.message} upload complete.\nChoose a song from the MSL\n💿: `, answer => {
          client.write(`!02!${answer}%02%`);
        });
      });
      break;
    }
    
    default:
      break;
  }
};
