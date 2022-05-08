/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare interface metadata {
  id: number | string;
  cover: imagefile;
  title: string;
  author: string;
  series?: string;
  sequence?: number | string;
  fileAs?: string;
  genre?: string;
  tags?: string;
  copyright?: string;
  publisher?: string;
  published?: string;
  language?: string;
  description?: string;
  showContents?: boolean;
  contents: string;
  source?: string;
  images: imagefile[];
  maker: string;
}

declare interface document {
  coverImage: imagefile;
  CSS: string;
  metadata: metadata;
  filesForTOC: { title: string; link: string; itemType: string }[];
  showContents: boolean;
  sections: {
    title: string;
    content: string;
    excludeFromContents: boolean;
    isFrontMatter: boolean;
    filename: string;
  }[];
  images: imagefile[];
  generateContentsCallback: CallableFunction;
  addSection: Function;
  addCSS: Function;
  getSectionCount: Function;
  getFilesForEPUB: Function;
  writeFilesForEPUB: Function;
  writeEPUB: Function;
}

declare interface file {
  name: string;
  folder: string;
  compress: boolean;
  content: string;
}

declare interface imagefile {
  name: string;
  path: string;
  data: File;
  originName: string;
}

declare interface book {
  path: string;
  data: string;
  title: string;
  author: string;
}
