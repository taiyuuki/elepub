// const { resolve } = require('path');
// const fsPromises = require('fs').promises;

/**
 * 异步forEach循环
 * @param arr 数组
 * @param cb 回调函数
 */
export const forEachAsync = async (arr: [], cb: CallableFunction) => {
  for (let index = 0; index < arr.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await cb(arr[index], index, arr);
  }
};

// 获取 image mimetype
export const getImageType = (filename: string) => {
  const imageExt = filename.substring(filename.lastIndexOf('.'));
  let imageType = '';
  imageType = imageExt === '.svg' ? 'image/svg+xml' : imageType;
  imageType = imageExt === '.png' ? 'image/png' : imageType;
  imageType =
    imageExt === '.jpg' || imageExt === '.jpeg' ? 'image/jpeg' : imageType;
  imageType = imageExt === '.gif' ? 'image/gif' : imageType;
  imageType =
    imageExt === '.tif' || imageExt === '.tiff' ? 'image/tiff' : imageType;
  return imageType;
};

// 创建文件夹
// export const makeFolder = async (topPath: string) => {
//   await fsPromises.mkdir(topPath).catch((err: { code: string }) => {
//     if (err && err.code !== 'EEXIST') {
//       throw err;
//     }
//     resolve();
//   });
// };

// 获取uuid
export const getUuid = (): string => {
  const url_uuid = URL.createObjectURL(new Blob());
  const uuid = url_uuid.toString(); //转字符串
  URL.revokeObjectURL(url_uuid); //释放
  return 'urn:uuid:' + uuid.substring(uuid.lastIndexOf('/') + 1);
};
