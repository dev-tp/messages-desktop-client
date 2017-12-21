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
    return months[month] + ' ' + day + ', ' + year;
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

        const recipientsDom = document.createElement('h1');
        recipientsDom.classList.add('recipients');
        recipientsDom.innerText = database[key].recipients.join(', ');

        const lastMessageIndex = database[key].messages.length - 1;
        const lastMessage = database[key].messages[lastMessageIndex];

        const messagePreviewDom = document.createElement('h2');
        messagePreviewDom.classList.add('message-preview');
        messagePreviewDom.innerText = lastMessage.body.split('\n')[0];

        const dateDom = document.createElement('p');
        dateDom.classList.add('date');
        dateDom.innerText = getReadableDate(date, lastMessage.date);

        threadDom.date = lastMessage.date;

        threadDom.appendChild(recipientsDom);
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
