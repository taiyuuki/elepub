import { getFileName, replacements } from './replacements';

const markup = {
  // 创建目录页.
  getContents: (document: document, overrideContents?: string) => {
    let result = '';
    result += "<?xml version='1.0' encoding='utf-8'?>[[EOL]]";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd' >[[EOL]]";
    result += "<html xmlns='http://www.w3.org/1999/xhtml'>[[EOL]]";
    result += '  <head>[[EOL]]';
    result += '    <title>[[CONTENTS]]</title>[[EOL]]';
    result +=
      "    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />[[EOL]]";
    result += '  </head>[[EOL]]';
    result += '  <body>[[EOL]]';

    if (overrideContents) {
      result += overrideContents;
    } else {
      result += "    <div class='contents'>[[EOL]]";
      result += '      <h1>[[CONTENTS]]</h1>[[EOL]]';
      for (let i = 1; i <= document.sections.length; i += 1) {
        const section = document.sections[i - 1];
        if (!section.excludeFromContents) {
          const { title } = section;
          result += `      <a href='s${i}.xhtml'>${title}</a><br/>[[EOL]]`;
        }
      }
      result += '    </div>[[EOL]]';
    }
    result += '  </body>[[EOL]]';
    result += '</html>[[EOL]]';
    return result;
  },

  // 创建TOC文件
  getTOC: (document: document) => {
    let content = '';
    if (document.generateContentsCallback) {
      const callbackContent = document.generateContentsCallback(
        document.filesForTOC
      );
      content = markup.getContents(document, callbackContent);
    } else {
      content = markup.getContents(document);
    }
    return replacements(document, replacements(document, content));
  },

  // 创建cover html页
  getCover: (document: document) => {
    const coverFilename = getFileName(document.coverImage.name);
    let result = '';
    result += "<?xml version='1.0' encoding='UTF-8' ?>[[EOL]]";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN'  'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>[[EOL]]";
    result +=
      "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'>[[EOL]]";
    result += '<head>[[EOL]]';
    result += '  <title>[[TITLE]]</title>[[EOL]]';
    result += "  <style type='text/css'>[[EOL]]";
    result += '    body { margin: 0; padding: 0; text-align: center; }[[EOL]]';
    result += '    .cover { margin: 0; padding: 0; font-size: 1px; }[[EOL]]';
    result += '    img { margin: 0; padding: 0; height: 100%; }[[EOL]]';
    result += '  </style>[[EOL]]';
    result += '</head>[[EOL]]';
    result += '<body>[[EOL]]';
    result += `  <div class='cover'><img style='height: 100%;width: 100%;' src='images/${coverFilename}' alt='Cover' /></div>[[EOL]]`;
    result += '</body>[[EOL]]';
    result += '</html>[[EOL]]';

    return replacements(document, replacements(document, result));
  },

  // 创建css文件
  getCSS: (document: document) =>
    replacements(document, replacements(document, document.CSS)),

  // 创建一个section html文件
  getSection: (document: document, sectionNumber: number) => {
    const section = document.sections[sectionNumber - 1];
    const { title } = section;
    const { content } = section;

    let result = '';
    result += "<?xml version='1.0' encoding='utf-8'?>[[EOL]]";
    result +=
      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>[[EOL]]";
    result += "<html xmlns='http://www.w3.org/1999/xhtml'>[[EOL]]";

    result += '  <head>[[EOL]]';
    result += `    <title>${title}</title>[[EOL]]`;
    result +=
      "    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />[[EOL]]";
    result += '  </head>[[EOL]]';
    result += '  <body>[[EOL]]';
    result += '    <div>[[EOL]]';

    const lines = content.split('\n');
    lines.forEach((line) => {
      if (line.length > 0) {
        result += `      ${line}[[EOL]]`;
      }
    });

    result += '    </div>[[EOL]]';
    result += '  </body>[[EOL]]';
    result += '</html>[[EOL]]';

    return replacements(document, replacements(document, result));
  },
};

export default markup;
