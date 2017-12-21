const net = require('net');

const client = new net.Socket();

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

      const threadsDom = document.getElementById('threads');

      Object.keys(database).forEach(function (key) {
        const threadDom = document.createElement('div');
        threadDom.classList.add('thread');
        threadDom.id = key;

        const recipientsDom = document.createElement('h1');
        recipientsDom.classList.add('recipients');
        recipientsDom.innerText = database[key].recipients.join(', ');

        const lastMessageIndex = database[key].messages.length - 1;
        const lastMessage = database[key].messages[lastMessageIndex];

        const messagePreviewDom = document.createElement('h2');
        messagePreviewDom.classList.add('message-preview');
        messagePreviewDom.innerText = lastMessage.body;

        const dateDom = document.createElement('p');
        dateDom.classList.add('date');
        dateDom.innerText = lastMessage.date;

        threadDom.appendChild(recipientsDom);
        threadDom.appendChild(messagePreviewDom);
        threadDom.appendChild(dateDom);

        threadsDom.appendChild(threadDom);
      });
    }
  }
});

client.on('error', console.log);
