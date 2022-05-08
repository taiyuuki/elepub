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
import { contextBridge } from 'electron';
import { forEachAsync } from '../src/factory/utility';
import fs from 'fs';
const fsPromises = require('fs').promises;
const archiver = require('archiver');
import {
  getBookMessage,
  getBookChapters,
  loadData,
  saveData,
  getSection,
  getCss,
  getImage,
  openFolder,
} from '../src/reader/get-book';
let counter = 0;

const preload = {
  getBookMessage,
  getBookChapters,
  loadData,
  saveData,
  getSection,
  getCss,
  getImage,
  openFolder,
  getGrogress: () => {
    return counter;
  },
  writeEPUB: async (filename: string, folder: string, files: file[]) => {
    counter = 0;
    const len = files.length;
    await fsPromises.mkdir(folder).catch((err: { code: string }) => {
      if (err && err.code !== 'EEXIST') {
        throw err;
      }
    });
    const output = fs.createWriteStream(`${folder}/${filename}.epub`);
    const zip = archiver('zip', {
      store: false,
    });
    // console.log(archive);
    zip.on('error', (archiveErr: Error) => {
      throw archiveErr;
    });
    zip.on(
      'progress',
      (e: { entries: { total: number; processed: number } }) => {
        counter = Math.floor((e.entries.processed * 100) / len);
      }
    );

    await new Promise(async (resolveWrite) => {
      zip.pipe(output);
      output.on('close', () => resolveWrite(true));

      await forEachAsync(files as [], async (file: file) => {
        if (file.folder === 'OEBPF/images') {
          const data = await fsPromises.readFile(file.content);
          file.content = data;
        }
        const fileFolder =
          file.folder.length > 0 ? `${file.folder}/${file.name}` : file.name;
        zip.append(file.content, {
          name: fileFolder,
          store: !file.compress,
        });
      });

      // Done.
      zip.finalize().then(() => {
        counter = 100;
      });
    });
  },
};

contextBridge.exposeInMainWorld('preload', preload);
