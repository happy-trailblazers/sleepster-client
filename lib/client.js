const net = require('net');
const fs = require('fs');
const client = net.createConnection(54321, 'localhost', () => {
  fs.readdir('/Users/CosmoProblems/tcp-share-file', (err, files) => {
    files.forEach(file => {
      client.write(`!01${file}`);

    });
  });
});

// client.setEncoding('utf8');
// client.on('data', data => {
//   console.log(data);
// });
