const net = require('net');

const client = net.createConnection(54321, 'localhost', () => {
  client.write('!01mysong');
});

// client.setEncoding('utf8');
// client.on('data', data => {
//   console.log(data);
// });
