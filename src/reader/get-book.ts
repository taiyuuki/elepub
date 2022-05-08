const Epub = require('epub');
const fs = require('fs');
const exec = require('child_process').exec;
const { compress, decompress } = require('shrink-string');
const cheerio = require('cheerio');
let book = {} as import('epub');
const imgList = {} as { [key: string]: string };

// 获取书籍信息
export const getBookMessage = (path: string): Promise<book> => {
  return new Promise((resolve, reject) => {
    const book = new Epub(path);
    try {
      book.parse();
    } catch (e) {
      reject(e);
    }
    book.on('end', () => {
      book.getImage(
        'cover-image',
        (err: Error, data: Buffer, mimeType: string) => {
          if (err) reject(err);
          resolve({
            title: book.metadata.title,
            author: book.metadata.creator,
            path: book.filename,
            data: `data:${mimeType};base64,${data.toString('base64')}`,
          });
        }
      );
    });
  });
};

// 获取章节列表
export const getBookChapters = (
  path: string
): Promise<{ id: string; title?: string }[][]> => {
  return new Promise((resolve, reject) => {
    book = new Epub(path);
    try {
      book.parse();
    } catch (e) {
      reject(e);
    }
    const chapters = [] as { id: string; title?: string }[][];
    book.on('end', () => {
      let tem = [] as { id: string; title?: string }[];
      for (const key in book.manifest) {
        if (book.manifest[key]['media-type'].indexOf('image') !== -1) {
          const section = book.manifest[key].href;
          const href = section.substring(section.lastIndexOf('/') + 1);
          imgList[href] = book.manifest[key].id;
        }
      }
      book.flow.forEach(
        (chapter: { id: string; title?: string }, i: number) => {
          if (i === book.flow.length - 1 && tem.length > 0) {
            chapters.push(tem);
            tem = [];
          }
          if (chapter.title) {
            if (tem.length > 0) {
              chapters.push(tem);
              tem = [];
            }
            tem.push({
              id: chapter.id,
              title: chapter.title,
            });
          } else {
            tem.push({
              id: chapter.id,
            });
          }
        }
      );
      resolve(chapters);
    });
  });
};

// 获取css
export const getCss = (): Promise<string> => {
  return new Promise((resolve) => {
    book.getFile('css', (err, data) => {
      if (err) {
        return;
      }
      resolve(`<style>${data.toString()}</style>`);
    });
  });
};

// 获取图片
export const getImage = (id: string): Promise<string> => {
  return new Promise((resolve) => {
    book.getImage(id, (err, img, type) => {
      let src = '';
      if (err) {
        throw err;
      }
      src = `data:${type};base64,${img.toString('base64')}`;
      resolve(src);
    });
  });
};

// 获取章节内容
export const getSection = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    book.getChapterRaw(id, (err: Error, text: string) => {
      if (err) throw reject(err);
      const $ = cheerio.load(text);
      if ($('img').length > 0) {
        $('img').each(async (_: number, item: { parent: HTMLElement }) => {
          const src = $(item).attr('src');
          const sub = src.substring(src.lastIndexOf('/') + 1);
          const targetSrc = await getImage(imgList[sub]);
          $(item).attr('src', targetSrc);
          resolve($(item.parent).html());
        });
      } else {
        resolve($('body').html());
      }
    });
  });
};

// 打开文件夹
export const openFolder = (folder: string) => {
  exec(`explorer.exe /select,"${folder}"`);
};

// 保存数据
export const saveData = async (data: string) => {
  const ws = fs.createWriteStream('./data.sav');
  const shrunk = await compress(data);
  ws.write(shrunk);
  ws.end();
};

// 读取数据
export const loadData = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data.sav', async (err: Error, data: Buffer) => {
      if (err) reject(err);
      if (data) {
        const loadData = await decompress(data.toString());
        resolve(loadData);
      }
    });
  });
};
