<p align="center">
<img src="https://taiyuuki.github.io/elepub-web-build/icons/logo.png" style="width:100px;" />
</p>


<h1 align="center">elepub</h1>

<p align="center">
 <a href="https://github.com/taiyuuki/elepub"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/taiyuuki/elepub?style=social"></a>
</p>

将漫画图片打包成 epub 的小工具，适配多看阅读，推荐用于条漫，页漫虽然也能用，但如果存在跨页，阅读体验不会好。

- [桌面版](https://github.com/taiyuuki/elepub/releases)只含 Windows 版本，Mac 版本需要下载源码自行打包。
- [Web 版](https://taiyuuki.github.io/elepub-web-build/)

## 更新 2.0.4

- 2.0.4
  新增目录编辑功能，支持导入目录标题（编码格式为utf-8的txt文件）。
- 2.0.3
  修正二次生成时内容会重复添加的 bug。
- 2.0.2
  修正图片列表卡顿的问题。
- 2.0.1
  合并桌面端和 Web 端，移除了桌面端的阅读功能，如果需要阅读功能请下载 2.0.0 版本。
- 2.0.0
  重制界面。

## 项目运行

本项目使用 electron 20.1.4、vue 3.2.41、Quasar 等框架开发，使用 Quasar-CLI(vite)构建。

### 安装依赖

```bash
yarn install
```

### 桌面端运行

```bash
yarn dev:electron
```

### 桌面端打包

```bash
yarn build:electron
```

### Web 端运行

```shell
yarn dev
```

### Web 端打包

```shell
yarn build
```

### Web 端 PWA 模式运行

```shell
yarn dev:pwa
```

### Web 端 PWA 模式打包

```shell
yarn build:pwa
```

PWA 模式下，采取缓存优先策略，离线可用，并可以将网页安装到设备（PC 或手机）桌面。
