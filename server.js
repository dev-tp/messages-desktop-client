const net = require('net');

const server = net.createServer(function (socket) {
  socket.write('Server echo');

  socket.on('data', function (data) {
    console.log(data.toString());
  });

  socket.on('end', socket.end);
});

server.listen(1337, '127.0.0.1');
