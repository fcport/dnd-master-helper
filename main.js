const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: false,
    },
    darkTheme: true,
  });
  win.webContents.openDevTools();
  win.loadFile(
    path.join(__dirname, "dist", "dnd-master-helper", "browser", "index.html")
  );
}

app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow);
