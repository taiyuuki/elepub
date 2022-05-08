import moment from 'moment';

// 根据文件完整目录获取文件名
export const getFileName = function (path: string): string {
  const pos1 = path.lastIndexOf('/');
  const pos2 = path.lastIndexOf('\\');
  const pos = Math.max(pos1, pos2);
  if (pos < 0) return path;
  else return path.substring(pos + 1);
};

// 替换单个标签
const tagReplace = (original: string, tag: string, value: string) => {
  const fullTag = `[[${tag}]]`;
  return original.split(fullTag).join(value || '');
};

// 替换所有标签
export const replacements = (
  document: { metadata: metadata },
  original: string
): string => {
  const modified = moment().format('YYYY-MM-DD');
  let result = original;
  result = tagReplace(result, 'EOL', '\n');
  result = tagReplace(result, 'COVER', document.metadata.cover.name);
  result = tagReplace(result, 'ID', document.metadata.id.toString());
  result = tagReplace(result, 'TITLE', document.metadata.title);
  result = tagReplace(result, 'SERIES', document.metadata.series || '');
  result = tagReplace(
    result,
    'SEQUENCE',
    (document.metadata.sequence || '').toString()
  );
  result = tagReplace(result, 'COPYRIGHT', document.metadata.copyright || '');
  result = tagReplace(result, 'LANGUAGE', document.metadata.language || '');
  result = tagReplace(result, 'FILEAS', document.metadata.fileAs || '');
  result = tagReplace(result, 'AUTHOR', document.metadata.author || '');
  result = tagReplace(result, 'PUBLISHER', document.metadata.publisher || '');
  result = tagReplace(
    result,
    'DESCRIPTION',
    document.metadata.description || ''
  );
  result = tagReplace(result, 'PUBLISHED', document.metadata.published || '');
  result = tagReplace(result, 'GENRE', document.metadata.genre || '');
  result = tagReplace(result, 'TAGS', document.metadata.tags || '');
  result = tagReplace(result, 'CONTENTS', document.metadata.contents);
  result = tagReplace(result, 'SOURCE', document.metadata.source || '');
  result = tagReplace(result, 'MAKER', document.metadata.maker);
  result = tagReplace(result, 'MODIFIED', modified);
  return result;
};
