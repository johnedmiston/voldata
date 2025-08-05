const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  importSpreadsheet: (filePath) => ipcRenderer.invoke('import-xlsx', filePath),
  getVolunteers: () => ipcRenderer.invoke('get-volunteers'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  updateVolunteer: (volunteer) => ipcRenderer.invoke('update-volunteer', volunteer),
  addVolunteer: (volunteer) => ipcRenderer.invoke('add-volunteer', volunteer),
});
