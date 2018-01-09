const net = require('net');

const client = new net.Socket();
const months = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
];

let database = null;
let segments = [];

function getReadableDate(currentDate, timestamp) {
  const date = new Date(timestamp);

  const currentDay = currentDate.getDate();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let hours = date.getHours();
  hours = hours < 10 ? '0' + hours : '' + hours;

  let minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : '' + minutes;

  const time = hours + ':' + minutes;

  if (currentDate.getFullYear() > year) {
    return months[month] + ' ' + day + ', ' + year + ' ' + time;
  } else if (currentDay < day || day < currentDay) {
    return months[month] + ' ' + day + ' ' + time;
  }

  return time;
}

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

      const date = new Date();
      const threadsDom = document.getElementById('threads');

      Object.keys(database).forEach(function (key) {
        const threadDom = document.createElement('div');
        threadDom.classList.add('thread');
        threadDom.id = key;

        const addressDom = document.createElement('h1');
        addressDom.classList.add('address');
        addressDom.innerText = database[key].address;

        const lastMessageIndex = database[key].messages.length - 1;
        const lastMessage = database[key].messages[lastMessageIndex];

        const messagePreviewDom = document.createElement('h2');
        messagePreviewDom.classList.add('message-preview');
        messagePreviewDom.innerText = lastMessage.body.split('\n')[0];

        const dateDom = document.createElement('p');
        dateDom.classList.add('date');
        dateDom.innerText = getReadableDate(date, lastMessage.date);

        threadDom.date = lastMessage.date;

        threadDom.onclick = function () {
          const messagesDom = document.getElementById('message-container');

          if (messagesDom.threadId === this.id) {
            return;
          }

          messagesDom.innerHTML = '';

          const date = new Date();

          database[this.id].messages.forEach(function (message) {
            const messageDom = document.createElement('div');
            messageDom.classList.add('message');

            if (!message.address) {
              messageDom.classList.add('message-author');
            }

            const bodyDom = document.createElement('p');
            bodyDom.classList.add('message-body');
            bodyDom.innerText = message.body;

            const dateDom = document.createElement('p');
            dateDom.classList.add('message-date');
            dateDom.innerText = getReadableDate(date, message.date);

            messageDom.appendChild(bodyDom);
            messageDom.appendChild(dateDom);

            messagesDom.appendChild(messageDom);
          });

          messagesDom.scrollTop = messagesDom.scrollHeight;
          messagesDom.threadId = this.id;
        };

        threadDom.appendChild(addressDom);
        threadDom.appendChild(messagePreviewDom);
        threadDom.appendChild(dateDom);

        threadsDom.appendChild(threadDom);
      });

      const nodes = Array.prototype.slice.call(threadsDom.childNodes, 0);

      nodes.sort(function (a, b) {
        return b.date - a.date;
      });

      threadsDom.innerHTML = '';

      nodes.forEach(function (node) {
        threadsDom.appendChild(node);
      });
    }
  }
});

client.on('error', console.log);

document.getElementById('composed-message').onkeyup = function () {
  document.getElementById('send-button').disabled = this.value.length === 0;
};

document.getElementById('send-button').onclick = function () {
  const composedMessageDom = document.getElementById('composed-message');
  const threadId = document.getElementById('message-container').threadId;

  const message = {};

  message[threadId] = {
    address: null,
    body: composedMessageDom.value,
    date: new Date().getTime(),
  };

  console.log(JSON.stringify(message));

  composedMessageDom.value = '';
  this.disabled = true;
};
