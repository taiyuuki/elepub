/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import type { IpcRendererEvent } from 'electron'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('wepubApi', {
  buildEpub: (epubData: EpubData) => {
    return ipcRenderer.invoke('build-epub', epubData)
  },
  getProgress: (
    callback: (event: IpcRendererEvent, progress: { value: number }) => void
  ) => ipcRenderer.on('progress', callback),
})