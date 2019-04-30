const net = require('net');
const fs = require('fs');
// const messageDecoder = require('./utils/messageDecoder');

const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir('/Users/meganmarshall/projects/career-track/week-1/functions', (err, files) => {
    client.write(`!01!${JSON.stringify(files)}%01%`);
    // files.forEach(file => {
    //   console.log(file);
    //   client.write(`!01${file}`);
    // });
    // client.write('')
  });
});

// client.setEncoding('utf8');
// client.on('data', data => {
//   console.log(data);
// });
