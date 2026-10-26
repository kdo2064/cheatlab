const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const os = require('os');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

const MAX_FILES_PER_DIR = 300;

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
}

// Known UWP/Windows Store game package name prefixes
const UWP_GAME_PACKAGES = [
  'Famobi.ShadowFight2',
  'Famobi.ShadowFight',
];

function scanDir(dir, depth, results) {
  if (depth <= 0) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  let count = 0;
  for (const entry of entries) {
    if (count++ > MAX_FILES_PER_DIR) break;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && depth > 1) {
      scanDir(full, depth - 1, results);
    } else if (entry.isFile() && /\.(txt|json)$/i.test(entry.name)) {
      try {
        const stat = fs.statSync(full);
        if (stat.size < 512 || stat.size > 10 * 1024 * 1024) continue;
        const content = readFileSafe(full);
        if (!content.startsWith('{')) continue;
        const json = JSON.parse(content);
        if (json && json.data && typeof json.data.SF2User === 'string') {
          results.push({
            filePath: full,
            name: entry.name,
            size: stat.size,
            mtime: stat.mtimeMs,
          });
        }
      } catch {}
    }
  }
}

// Scan AppData\Local\Packages\ for UWP game packages
function getUWPGameDirs() {
  const home = os.homedir();
  const packagesDir = path.join(home, 'AppData', 'Local', 'Packages');
  const dirs = [];
  try {
    const packages = fs.readdirSync(packagesDir, { withFileTypes: true });
    for (const pkg of packages) {
      if (!pkg.isDirectory()) continue;
      const isGame = UWP_GAME_PACKAGES.some((p) => pkg.name.toLowerCase().startsWith(p.toLowerCase()));
      if (!isGame) continue;
      const localState = path.join(packagesDir, pkg.name, 'LocalState');
      if (fs.existsSync(localState)) dirs.push(localState);
    }
  } catch {}
  return dirs;
}

function getScanDirs() {
  const home = os.homedir();
  return [
    // Windows Store / UWP games (highest priority — direct game save location)
    ...getUWPGameDirs(),
    // Common user folders (manual copies)
    path.join(home, 'Desktop'),
    path.join(home, 'Downloads'),
    path.join(home, 'Documents'),
    path.join(home, 'Documents', 'My Games'),
    path.join(home, 'Saved Games'),
    // Android emulators (for users who play on emulator)
    path.join(home, 'AppData', 'Local', 'BlueStacks_nxt', 'UserData', 'SharedFolder'),
    path.join(home, 'AppData', 'Local', 'BlueStacks_nxt2', 'UserData', 'SharedFolder'),
    'C:\\ProgramData\\BlueStacks\\Engine\\UserData\\SharedFolder',
    'C:\\LDPlayer\\LDPlayer9\\vms\\operateFiles',
    path.join(home, 'AppData', 'Local', 'LDPlayer', 'vms', 'leidian0', 'operateFiles'),
    path.join(home, 'AppData', 'Local', 'Nox', 'bin'),
    'C:\\Program Files\\Microvirt\\MEmu\\MemuFiles',
  ];
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    backgroundColor: '#080806',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.on('maximize',   () => win.webContents.send('window:maximized'));
  win.on('unmaximize', () => win.webContents.send('window:unmaximized'));
}

app.whenReady().then(() => {
  createWindow();
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  }
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

autoUpdater.on('update-available', (info) => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) win.webContents.send('updater:update-available', info.version);
});

autoUpdater.on('update-downloaded', () => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) win.webContents.send('updater:update-downloaded');
});

autoUpdater.on('error', () => {});

ipcMain.handle('updater:install', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('window:minimize', (e) => BrowserWindow.fromWebContents(e.sender)?.minimize());
ipcMain.on('window:maximize', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on('window:close', (e) => BrowserWindow.fromWebContents(e.sender)?.close());
ipcMain.handle('window:isMaximized', (e) => BrowserWindow.fromWebContents(e.sender)?.isMaximized() ?? false);

ipcMain.handle('file:open', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Open Save File',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths.length) return null;
  const filePath = result.filePaths[0];
  const content = readFileSafe(filePath);
  return { filePath, content, name: path.basename(filePath) };
});

ipcMain.handle('file:save', async (event, { filePath, content }) => {
  try {
    const backupPath = filePath + '.backup';
    if (fs.existsSync(filePath) && !fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('file:scan', async () => {
  const home = os.homedir();
  const results = [];
  const uwpDirs = getUWPGameDirs();

  for (const dir of getScanDirs()) {
    const isUWP    = uwpDirs.includes(dir);
    const isDeep   = !dir.startsWith(home);  // emulator paths outside home
    // UWP: depth 5 (LocalState/GameStorage/shadow-fight-2/file.txt)
    // deep emulator paths: depth 4
    // user folders: depth 3
    const depth = isUWP ? 5 : isDeep ? 4 : 3;
    scanDir(dir, depth, results);
  }

  // deduplicate by filePath, sort newest first
  const seen = new Set();
  const unique = results.filter((r) => {
    if (seen.has(r.filePath)) return false;
    seen.add(r.filePath);
    return true;
  });
  return unique.sort((a, b) => b.mtime - a.mtime);
});

ipcMain.handle('file:openByPath', async (event, filePath) => {
  try {
    const content = readFileSafe(filePath);
    return { filePath, content, name: path.basename(filePath) };
  } catch (err) {
    return null;
  }
});

ipcMain.handle('file:saveAs', async (event, { content, defaultName }) => {
  const result = await dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: defaultName,
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  });
  if (result.canceled || !result.filePath) return null;
  fs.writeFileSync(result.filePath, content, 'utf-8');
  return { filePath: result.filePath, name: path.basename(result.filePath) };
});
