const net = require('net');
const fs = require('fs');
const { parse } = require('url');
const { messageExtractor } = require('./messageDecoder');
const searchQuestions = require('../inquirer/search');
const finishedQuestion = require('../inquirer/postDownload');

module.exports = async(result, client, downloadClient) => {
  const messageDetails = messageExtractor(result);
  switch(messageDetails.messageCode) {
    case '11': {
      const answer = await searchQuestions(messageDetails.message);
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
      downloadingClient.on('end', async() => {
        await finishedQuestion();
        client.write('!05!%05%');
      });
      break;
    }
    case '03': {
      const { songPath } = JSON.parse(messageDetails.message);
      const fileRead = fs.createReadStream(songPath);
      fileRead.pipe(downloadClient);
      break;
    }
    
    default:
      break;
  }
};
