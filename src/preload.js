const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  connectToOllama: (url) => ipcRenderer.invoke('connect-to-ollama', url),
  sendMessage: (options) => ipcRenderer.invoke('send-message', options),
});