pub const COVER: &str = r#"<?xml version='1.0' encoding='UTF-8' ?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN'  'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'>
<head>
  <title>{title}</title>
  <style type='text/css'>
    body { margin: 0; padding: 0; text-align: center; }
    .cover { margin: 0; padding: 0; font-size: 1px; }
    img { margin: 0; padding: 0; height: 100%; }
  </style>
</head>
<body>
  <div class='cover'><img style='height: 100%;width: 100%;' src='images/{cover}' alt='Cover' /></div>
</body>
</html>"#;

pub const MIMETYPE: &str = r#"<?xml version="1.0" encoding="UTF-8"?>
<duokan-extension version="2.4.0">
  <display-options layout="vertical-comic"/>
  <writing-options>
    <option name="writing-mode">horizontal-tb</option>
    <option name="direction">ltr</option>
  </writing-options>
</duokan-extension>"#;

pub const CONTAINER: &str = r#"<?xml version='1.0' encoding='UTF-8' ?>
<container version='1.0' xmlns='urn:oasis:names:tc:opendocument:xmlns:container'>
  <rootfiles>
    <rootfile full-path='OEBPF/ebook.opf' media-type='application/oebps-package+xml'/>
  </rootfiles>
</container>"#;

pub const SECTION: &str = r#"<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
  <head>
    <title>{title}</title>
    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
  </head>
  <body>
    <div>
      <img alt='{image}' src='../images/{image}'/>
    </div>
  </body>
</html>"#;

pub const CSS: &str = r#"body {
  padding: 0;
  margin: 0;
  text-indent: 0;
  duokan-text-indent: 0;
 }
 p {
  text-indent: 0;
  duokan-text-indent: 0;
  display: block;
  line-height: 1.3em;
  margin-top: 0.6em;
  margin-bottom: 0.6em;
 }
 div {
  text-indent: 0;
  duokan-text-indent: 0;
  margin: 0;
  padding: 0;
  text-align: justify;
 }
 img {
  width: 100%;
 }
 a {
  text-decoration: none;
 }
 a:hover {
  background-color: rgba(0, 0, 0, 0.5);
 }
 .box {
  color: #258;
  padding: 5px;
  margin: 10% -0.25em;
  border: 1px solid #258;
  background-color: rgba(34, 85, 136, 0.1);
 }
 .box p {
  font-size: 0.8em;
 }
 .book {
  font-family: "微软雅黑", "黑体", "ht", "sans-serif";
 }
 .book p {
  font-size: 1em;
  text-shadow: 1px 1px 1px #fff;
  text-indent: 0;
  duokan-text-indent: 0;
 }
 .meg {
  margin: -5px;
  padding: 5px;
  color: #fff;
  font-family: "gy", "DK-FANGSONG", "fs", "fangsong", "仿宋";
  font-weight: bold;
  font-size: 1.2em;
  text-indent: 0;
  duokan-text-indent: 0;
  text-align: center;
  line-height: 120%;
  background-color: #258;
 }
 .option {
  font-family: "gy", "DK-FANGSONG", "fs", "fangsong", "仿宋";
  font-size: 1em;
  font-weight: bold;
  margin: -5px;
  padding: 5px;
  line-height: 120%;
  background-color: rgba(34, 85, 136, 0.8);
  color: #fff;
 }
 .option p {
  text-indent: -4em;
  duokan-text-indent: -4em;
  padding-left: 4em;
 }"#;

pub const MESSAGE: &str = r#"<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
  <head>
    <title>说明</title>
    <link rel='stylesheet' type='text/css' href='../css/ebook.css' />
  </head>
  <body>
    <div>
      <div class="box">
       <h1 class="meg">说明</h1>
       <div class="book">
       <p>书　名：{title} {volume}</p>
       <p>图　文：{author}</p>
       <p>制　作：{creator}</p>
       </div>
       <div class="option">
       <p>声　明：此EPUB文档由软件自动生成，仅供测试，禁止传播和商用。</p>
       <p>地　址：<a href="https://taiyuuki.github.io/elepub-web-build/"><span style="color:#fff">https://taiyuuki.github.io/elepub-web-build/</span></a></p>
       <p>阅读器：请使用<a href="http://www.duokan.com/product"><span style="color:#fff">多看阅读</span></a>，并将翻页模式设置为“上下翻页”。</p>
       </div>
       </div>
    </div>
  </body>
</html>"#;
