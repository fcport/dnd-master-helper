const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, 'dist', 'dnd-master-helper', 'index.html'));

}

app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow);
