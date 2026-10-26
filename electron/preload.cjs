const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  file: {
    open:       ()         => ipcRenderer.invoke('file:open'),
    save:       (data)     => ipcRenderer.invoke('file:save', data),
    saveAs:     (data)     => ipcRenderer.invoke('file:saveAs', data),
    scan:       ()         => ipcRenderer.invoke('file:scan'),
    openByPath: (filePath) => ipcRenderer.invoke('file:openByPath', filePath),
  },
  window: {
    minimize:    () => ipcRenderer.send('window:minimize'),
    maximize:    () => ipcRenderer.send('window:maximize'),
    close:       () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onMaximizeChange: (cb) => {
      ipcRenderer.on('window:maximized',   () => cb(true));
      ipcRenderer.on('window:unmaximized', () => cb(false));
    },
  },
  updater: {
    install: () => ipcRenderer.invoke('updater:install'),
    onUpdateAvailable:  (cb) => ipcRenderer.on('updater:update-available',  (_e, v) => cb(v)),
    onUpdateDownloaded: (cb) => ipcRenderer.on('updater:update-downloaded',  () => cb()),
  },
});
