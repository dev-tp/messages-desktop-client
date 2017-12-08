const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let browserWindow;

function createWindow() {
  browserWindow = new BrowserWindow({width: 800, height: 600});

  browserWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  browserWindow.webContents.openDevTools();

  browserWindow.on('closed', function () {
    browserWindow = null;
  });
}

app.on('activate', function () {
  if (browserWindow === null) {
    createWindow();
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
