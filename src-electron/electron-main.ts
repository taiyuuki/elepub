import type { IpcMainInvokeEvent } from 'electron'
import {
  app,
  BrowserWindow,
  nativeTheme,
  session,
  ipcMain,
  Menu,
} from 'electron'
import path from 'path'
import os from 'os'
import buildEpub from './electron-wepub'

let progress = 0

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    )
  }
}
catch (e) {
  console.log(e)
}

let mainWindow: BrowserWindow | undefined

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/logo.png'), // tray icon
    width: 1024,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })
    createMenu()
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\' http://localhost'],
      },
    })
  })

  // write epub and send the progress to renderer process
  async function handleBuildEpub(_: IpcMainInvokeEvent, epubData: EpubData) {
    const complate = await buildEpub(epubData, (p: number) => {
      progress = p
      if (mainWindow) {mainWindow.webContents.send('progress', progress)}
    })
    return complate
  }
  ipcMain.handle('build-epub', handleBuildEpub)

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})

function createMenu() {
  // darwin Mac
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([{ label: 'elepub', submenu: [{ role: 'quit' }] }])
    )
  }
  else {
    // windows linux
    Menu.setApplicationMenu(null)
  }
}