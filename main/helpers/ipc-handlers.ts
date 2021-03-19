import { ipcMain, dialog, app } from 'electron'

import store from './store';

ipcMain.handle('get-notes-dir', () => {
  const result = dialog.showOpenDialogSync({
      title: "Set Notes directory",
      properties: ["openDirectory", "createDirectory"],
      message: "Where all your notes are stored",
  });
  return result;
})

ipcMain.handle('setStoreValue', (event, payload) => {
	return store.set(payload.key, payload.value);
});

ipcMain.handle('getStoreValue', (event, key) => {
	return store.get(key);
});

ipcMain.handle('ask-user-question', (event, payload) => {
  return dialog.showMessageBoxSync(payload)
})

ipcMain.on('quit', () => {
  app.quit();
  app.exit();
})