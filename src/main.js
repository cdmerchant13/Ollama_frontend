const { app, BrowserWindow, ipcMain } = require('electron');
const { Ollama } = require('ollama');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let ollama;

ipcMain.handle('connect-to-ollama', async (event, url) => {
  try {
    ollama = new Ollama({ host: url });
    const response = await ollama.list();
    return response.models;
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    return { error: 'Failed to connect to Ollama. Please check the URL and try again.' };
  }
});

ipcMain.handle('send-message', async (event, { model, message, systemPrompt }) => {
  try {
    const messages = [{ role: 'user', content: message }];
    if (systemPrompt) {
      messages.unshift({ role: 'system', content: systemPrompt });
    }

    const response = await ollama.chat({
      model: model,
      messages: messages,
    });
    console.log('Ollama API Response:', response);
    return response.message.content;
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message. Please try again.' };
  }
});
