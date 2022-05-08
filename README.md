# elepub

可以将漫画图片打包成epub，适配多看阅读（滚动翻页），推荐用于条漫，页漫虽然也能用，但如果存在跨页，阅读体验不会好。

## v2.0.0

* v2.0.0基于electron目前最新版（v18.2.0），使用quasar-cli构建，不再依赖Nodepub，功能基本不变，只是调整了界面。

* [Releases](https://github.com/taiyuuki/elepub/releases)只含Windows版本，Mac理论上也能用，需要可以自行下载打包，但文件相关的个别功能可能用不了。
* [Web版](https://taiyuuki.github.io/elepub-web-build/)

## 阅读功能

* 附带阅读功能，可以用来测试生成效果，**但仅限于elepub生成的EPUB**。

## Install the dependencies
```bash
npm i
```

### Start in development mode
```bash
npm run dev:electron
```

### Build for production
```bash
npm run build:electron
```
