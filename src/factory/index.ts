// const fs = require('fs');
// const archiver = require('archiver');
import structuralFiles from './constituents/structural';
import markupFiles from './constituents/markup';
// import { makeFolder } from './utility';
import { getFileName } from './constituents/replacements';
import { getUuid } from './utility';
// 构造 Epub
const Epub = (
  metadata: metadata,
  generateContentsCallback?: CallableFunction
) => {
  const epub = {} as document;
  epub.CSS = '';
  epub.sections = [];
  epub.images = [] as imagefile[];
  epub.metadata = metadata;
  if (generateContentsCallback) {
    epub.generateContentsCallback = generateContentsCallback;
  }
  epub.showContents = true;
  epub.filesForTOC = [];
  epub.coverImage = {} as imagefile;

  // 初始化元数据
  if (epub.metadata.id.toString().trim().length === 0) {
    epub.metadata.id = getUuid();
  }
  if (epub.metadata.title.trim().length === 0) {
    epub.metadata.title = 'example';
  }
  if (epub.metadata.author.trim().length === 0) {
    epub.metadata.author = '未知';
  }
  if (epub.metadata.maker.trim().length === 0) {
    epub.metadata.maker = 'elepub';
  }
  if (!epub.metadata.cover.hasOwnProperty('data')) {
    epub.metadata.cover = {
      name: 'cover.jpg',
      path: epub.metadata.images[0].path,
      data: epub.metadata.images[0].data,
      originName: epub.metadata.images[0].name,
    };
  }

  // 元数据验证
  const required = ['id', 'title', 'author', 'cover'];
  if (metadata == null) throw new Error('Missing metadata');
  required.forEach((field) => {
    const prop = metadata[field as keyof metadata];
    if (
      prop == null ||
      typeof prop === 'undefined' ||
      prop.toString().trim() === ''
    )
      throw new Error(`Missing metadata: ${field}`);
    if (field === 'cover') {
      epub.coverImage = <imagefile>prop;
    }
  });
  if (
    metadata.showContents !== null &&
    typeof metadata.showContents !== 'undefined'
  ) {
    epub.showContents = metadata.showContents;
  }

  /**
   * 添加section
   * @param title 标题
   * @param content 内容（html中 body 的内容）
   * @param excludeFromContents 是否在目录中索引
   * @param isFrontMatter 是否位于目录前
   * @param overrideFilename 文件名
   */
  epub.addSection = (
    title: string,
    content: string,
    excludeFromContents?: boolean,
    isFrontMatter?: boolean,
    overrideFilename?: string
  ) => {
    let filename = overrideFilename;
    if (
      filename == null ||
      typeof filename === 'undefined' ||
      filename.toString().trim() === ''
    ) {
      const i = epub.sections.length + 1;
      filename = `s${i}`;
    }
    filename = `${filename}.xhtml`;
    epub.sections.push({
      title,
      content,
      excludeFromContents: excludeFromContents || false,
      isFrontMatter: isFrontMatter || false,
      filename,
    });
  };

  // 添加css文件进epub，它将被应用于所有html文件。
  epub.addCSS = (content: string) => {
    epub.CSS = content;
  };

  // 获取section的数量
  epub.getSectionCount = () => epub.sections.length;

  // 获取epub中需要的文件，compress值为false的，不能被压缩，以STORE的方式储存
  epub.getFilesForEPUB = async () => {
    const syncFiles = [];

    // 必要的文件
    syncFiles.push({
      name: 'mimetype',
      folder: '',
      compress: false,
      content: structuralFiles.getMimetype(),
    });
    syncFiles.push({
      name: 'container.xml',
      folder: 'META-INF',
      compress: true,
      content: structuralFiles.getContainer(epub),
    });
    syncFiles.push({
      name: 'duokan-extension.xml',
      folder: 'META-INF',
      compress: true,
      content: structuralFiles.getDuokanExtension(epub),
    });
    syncFiles.push({
      name: 'ebook.opf',
      folder: 'OEBPF',
      compress: true,
      content: structuralFiles.getOPF(epub),
    });
    syncFiles.push({
      name: 'navigation.ncx',
      folder: 'OEBPF',
      compress: true,
      content: structuralFiles.getNCX(epub),
    });
    syncFiles.push({
      name: 'cover.xhtml',
      folder: 'OEBPF',
      compress: true,
      content: markupFiles.getCover(epub),
    });

    // css文件
    syncFiles.push({
      name: 'ebook.css',
      folder: 'OEBPF/css',
      compress: true,
      content: markupFiles.getCSS(epub),
    });
    for (let i = 1; i <= epub.sections.length; i += 1) {
      const fname = epub.sections[i - 1].filename;
      syncFiles.push({
        name: `${fname}`,
        folder: 'OEBPF/content',
        compress: true,
        content: markupFiles.getSection(epub, i),
      });
    }

    // 索引文件
    if (epub.showContents) {
      syncFiles.push({
        name: 'toc.xhtml',
        folder: 'OEBPF/content',
        compress: true,
        content: markupFiles.getTOC(epub),
      });
    }

    // 导入图片
    const coverFilename = getFileName(epub.coverImage.name);
    syncFiles.push({
      name: coverFilename,
      folder: 'OEBPF/images',
      compress: true,
      content: epub.coverImage.path,
    });
    if (epub.metadata.images) {
      epub.metadata.images.forEach((image: imagefile) => {
        const imageFilename = getFileName(image.name);
        syncFiles.push({
          name: imageFilename,
          folder: 'OEBPF/images',
          compress: true,
          content: image.path,
        });
      });
    }

    // 返回文件
    return syncFiles;
  };

  // 写入EPUB，文件名不需要含扩展名
  epub.writeEPUB = async (
    filename: string,
    folder: string,
    progress: { value: number }
  ) => {
    const files = await epub.getFilesForEPUB();
    const stamp = setInterval(() => {
      progress.value = window.preload.getGrogress();
    }, 50);
    await window.preload.writeEPUB(filename, folder, files);
    clearInterval(stamp);
  };
  return epub;
};

export default Epub;
