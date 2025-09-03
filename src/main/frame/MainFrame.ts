import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
export default class MainFrame {
  #frame: any = null;
  #width = 1150;
  #height = 750;
  create() {
    this.#frame = new BrowserWindow({
      width: this.#width,
      height: this.#height,
      show: false,
      frame: false,
      resizable: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    this.#frame.on('ready-to-show', () => {
      this.#frame.show()
    })

    this.#frame.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.#frame.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.#frame.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  close() {
    this.#frame.close();
  }
}
