import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { runMigration } from './src/migration-util.js'; // Import the worker

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  win.loadURL(isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, 'dist/index.html')}`);
}

// --- FILE PICKER ---
ipcMain.handle('select-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Access Databases', extensions: ['mdb'] }]
  });
  return canceled ? null : filePaths[0];
});

// --- MIGRATION TRIGGER ---
ipcMain.on('save-mdb-path', async (event, mdbPath) => {
  try {
    const result = await runMigration(mdbPath);
    event.reply('migration-finished', result);
  } catch (err) {
    console.error("Migration Error:", err);
    event.reply('migration-finished', { success: false, error: err.message });
  }
});

// App Lifecycle
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });