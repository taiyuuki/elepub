<p align="center">
<img src="https://taiyuuki.github.io/elepub-web-build/icons/logo.png" style="width:100px;" />
</p>


<h1 align="center">elepub</h1>

<p align="center">
 <a href="https://github.com/taiyuuki/elepub"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/taiyuuki/elepub?style=social"></a>
</p>

将漫画图片打包成 epub 的小工具，适配多看阅读，推荐用于条漫，页漫虽然也能用，但如果存在跨页，阅读体验不会好。

## 下载和使用

- [Windows版下载](../../releases) 
- Mac版请下载源码自行打包，由于我并没有对其进行配置，如果打包失败，请参考Tauri的[文档](https://tauri.app/v1/guides/building/macos)。
- [在线版](https://taiyuuki.github.io/elepub-web-build/) 
  在线版的生产速度会慢很多，且最大支持2GB的文档。如果图片较多、较大，建议使用Windows版。

导入图片如果遇到杀毒软件安全警告，请关闭杀毒软件或选择允许。开源项目，请放心使用。

## 更新 3.0.2

* 3.0.2 修正创建日期

* 3.0.1 修正bug 显示进度

* `3.0.0`使用`Tauri`重构了整个项目，界面基本维持原样，但得益于`Tauri`使用`Rust`的优势，大幅提高了EPUB的生产速度（提速90%以上），大幅减少软件包大小(68MB→2.8MB)，软件安装后占用也更小（150MB→6MB）。

如果遇到问题，欢迎提[issue](../../issues)，我会尽快修复。

Web + electron的版本理论上不再更新，但代码保留在本仓库[electron](../../tree/electron)分支。

## 项目运行

本项目使用<del> electron</del> Tauri、Vue、Quasar 等框架开发。

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm tauri dev
```

### 打包

```bash
pnpm tauri build
```
