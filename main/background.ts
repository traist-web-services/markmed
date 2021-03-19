import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import './helpers/ipc-handlers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    show: false
  });
  mainWindow.maximize();

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    
  }

  console.log(app.name)
  app.setAboutPanelOptions({
    applicationName: app.getName(),
    applicationVersion: app.getVersion(),
    credits: 'TK',
    authors: 'Joe Innes',
    website: 'TK',
    iconPath: '../resources/icon.png'
  })

  mainWindow.show();

})();

app.on('window-all-closed', () => {
  app.quit();
});
