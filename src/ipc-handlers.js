// src/ipc-handlers.js
import { runMigration } from './migration-util.js';
import sqlite3 from 'sqlite3';

export function setupIpcHandlers(ipcMain, dialog) {
  
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

  ipcMain.handle('get-locations', async () => {
    const db = new sqlite3.Database('./migrated_data.sqlite');
    return new Promise((resolve) => {
      const sql = `SELECT DISTINCT TRIM(Area) || '-' || TRIM(AreaLoc) as label 
                  FROM Settings WHERE Area > '' ORDER BY Area ASC`;

      db.all(sql, [], (err, rows) => {
        if (err) console.error("Settings Error:", err);
        resolve(err ? [] : rows.map(r => r.label));
        db.close();
      });
    });
  });
}