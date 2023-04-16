declare interface ImageInfo {
  title: string,
  xhtml: string,
  name: string,
  path: string,
  index: boolean,
  mime: string,
}

declare interface Metadata {
  id: string,
  cover: ImageInfo,
  title: string,
  author: string,
  images: ImageInfo[],
  output: string,
  creator: string,
  volume: string,
  publisher: string,
  description: string,
  date: string,
}