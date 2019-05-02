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
      console.log('MSD.MESG', messageDetails.message);
      const answer = await searchQuestions(messageDetails.message);
      console.log(answer);
      client.write(`!02!${answer}%02%`);
      break;
    }
    case '12': {
      const { url, songTitle, songPath } = JSON.parse(messageDetails.message);
      const { hostname, port } = parse(url);
      const downloadPackage = { songTitle, songPath };
      const downloadingClient = net.createConnection(port, hostname, () => {
        downloadingClient.write(`!03!${JSON.stringify(downloadPackage)}%03%`);
      });
      const writeStream = fs.createWriteStream(`${client.savePath}/${songTitle}`);
      downloadingClient.pipe(writeStream);
      downloadingClient.on('end', () => {
        console.log('FINISHED DOWNLOAD');
        // rl.question(`${songTitle} download complete.\nChoose another song from the MSL\n💿: `, answer => {
        //   client.write(`!02!${answer}%02%`);
        // });
      });
      
      break;
    }
    case '03': {
      const { songTitle, songPath } = JSON.parse(messageDetails.message);
      const fileRead = fs.createReadStream(songPath);
      fileRead.pipe(downloadClient);
      fileRead.on('end', () => {
        // rl.question(`${messageDetails.message} upload complete.\nChoose a song from the MSL\n💿: `, answer => {
        //   client.write(`!02!${answer}%02%`);
        // });
      });
      break;
    }
    
    default:
      break;
  }
};
