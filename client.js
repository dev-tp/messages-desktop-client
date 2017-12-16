const net = require('net');

const client = new net.Socket();

const threadsDom = document.getElementById('threads');

let database = null;
let segments = [];

client.connect(1337, '127.0.0.1', function () {
  console.log('Client connected to server');
});

client.on('data', function (data) {
  const segment = data.toString();

  segments.push(segment);

  if (segment.endsWith('\n')) {
    if (!database) {
      database = JSON.parse(segments.join(''));
      segments = [];

      console.log('Loading view');

      Object.keys(database).forEach(function (key) {
        const paragraphDom = document.createElement('p');

        const threadDom = document.createElement('a');
        threadDom.innerText = database[key].recipients.join(', ');
        threadDom.href = 'index.html?thread=' + key;

        paragraphDom.appendChild(threadDom);
        threadsDom.appendChild(paragraphDom);
      });
    }
  }
});

client.on('error', console.log);
