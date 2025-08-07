const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');

// Import helper functions
const { insertVolunteers, updateVolunteer, addVolunteer, getImportStats, cleanPhoneNumbers } = require('./database/db');
const { parseSpreadsheet } = require('./xlsx/import');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Communication between front and Electron
        },
    });

    win.loadFile(path.join(__dirname, 'renderer/index.html'));
}

// Start the application
app.whenReady().then(() => {
    createWindow();

    // For macOS: recreate window when clicking on app icon
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Close application if not on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// 🔁 Communication with frontend (XLSX import)
ipcMain.handle('select-file', async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const data = parseSpreadsheet(filePath);
            const importResult = await insertVolunteers(data);
            return { 
                success: true, 
                message: `Import completed! ${importResult.inserted} records inserted, ${importResult.duplicates} duplicates found, ${importResult.exactDuplicates} identical records ignored.`,
                details: importResult
            };
        } else {
            return { success: false, error: 'No file selected' };
        }
    } catch (error) {
        console.error('Failed to import spreadsheet:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('import-xlsx', async (event, filePath) => {
    try {
        const data = parseSpreadsheet(filePath);
        const importResult = await insertVolunteers(data);
        return { 
            success: true, 
            message: `Import completed! ${importResult.inserted} records inserted, ${importResult.duplicates} duplicates found, ${importResult.exactDuplicates} identical records ignored.`,
            details: importResult
        };
    } catch (error) {
        console.error('Failed to import spreadsheet:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-volunteers', async () => {
    const db = new sqlite3.Database(path.join(__dirname, 'volunteers.db'));

    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM volunteers', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
            db.close();
        });
    });
});

ipcMain.handle('update-volunteer', async (event, volunteer) => {
    try {
        await updateVolunteer(volunteer);
        return { success: true };
    } catch (error) {
        console.error('Failed to update volunteer:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('add-volunteer', async (event, volunteer) => {
    try {
        const addedVolunteer = await addVolunteer(volunteer);
        return { success: true, volunteer: addedVolunteer };
    } catch (error) {
        console.error('Failed to add volunteer:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-import-stats', async () => {
    try {
        const totalRecords = await getImportStats();
        return { success: true, totalRecords };
    } catch (error) {
        console.error('Failed to get import stats:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('clean-phone-numbers', async () => {
    try {
        await cleanPhoneNumbers();
        return { success: true, message: 'Phone numbers cleaned successfully' };
    } catch (error) {
        console.error('Failed to clean phone numbers:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('export-to-excel', async () => {
    try {
        const db = new sqlite3.Database(path.join(__dirname, 'volunteers.db'));
        
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM volunteers', (err, rows) => {
                if (err) {
                    db.close();
                    reject(err);
                    return;
                }
                
                db.close();
                
                if (rows.length === 0) {
                    resolve({ success: false, error: 'No data to export' });
                    return;
                }
                
                // Create workbook and worksheet
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(rows);
                
                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Volunteers');
                
                // Show save dialog
                dialog.showSaveDialog({
                    title: 'Export Volunteers to Excel',
                    defaultPath: 'volunteers_export.xlsx',
                    filters: [
                        { name: 'Excel Files', extensions: ['xlsx'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                }).then((result) => {
                    if (!result.canceled && result.filePath) {
                        // Write file
                        XLSX.writeFile(workbook, result.filePath);
                        resolve({ 
                            success: true, 
                            message: `Successfully exported ${rows.length} records to ${result.filePath}`,
                            filePath: result.filePath,
                            recordCount: rows.length
                        });
                    } else {
                        resolve({ success: false, error: 'Export cancelled' });
                    }
                }).catch((error) => {
                    resolve({ success: false, error: error.message });
                });
            });
        });
    } catch (error) {
        console.error('Failed to export to Excel:', error);
        return { success: false, error: error.message };
    }
});
