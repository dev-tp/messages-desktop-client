const net = require('net');

const client = new net.Socket();

const messageInputBox = document.getElementById('input-message');
const messagesDom = document.getElementById('messages');
const sendMessageButton = document.getElementById('send-message-button');

function sendMessage() {
  const messageDom = document.createElement('p');

  messageDom.innerText = 'Me: ' + messageInputBox.value;
  messagesDom.appendChild(messageDom);

  client.write(messageInputBox.value);

  messageInputBox.value = '';
}

client.connect(1337, '127.0.0.1', function () {
  console.log('Client connected to server');
});

client.on('data', function (data) {
  const messageDom = document.createElement('p');

  messageDom.innerText = 'Received: ' + data.toString();

  messagesDom.appendChild(messageDom);
});

client.on('error', console.log);

messageInputBox.onkeypress = function (event) {
  const code = event.keyCode || event.which;

  if (code == '13') {
    sendMessage();
  }
};

sendMessageButton.onclick = sendMessage;
