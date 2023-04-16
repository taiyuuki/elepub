import { describe, it, expect } from 'vitest'
import { template } from '../src/factory/template'

describe('template', () => {
  it('get css', () => {
    expect(template.getMessage()).toMatchInlineSnapshot(`
      "
      <div class=\\"box\\">
              <h1 class=\\"meg\\">说明</h1>
              <div class=\\"book\\">
                <p>书　名：[[TITLE]] [[SEQUENCE]]</p>
                <p>图　文：[[AUTHOR]]</p>
                <p>制　作：[[MAKER]]</p>
              </div>
              <div class=\\"option\\">
                <p style=\\"text-indent:-4em;duokan-text-indent:-4em;padding-left:4em\\">声　明：此EPUB文档由软件自动生成，仅供测试，禁止传播和商用。</p>
                <p style=\\"text-indent:-4em;duokan-text-indent:-4em;padding-left:4em\\">地　址：<a href=\\"https://taiyuuki.github.io/elepub-web-build/\\"><span style=\\"color:#fff\\">https://taiyuuki.github.io/elepub-web-build/</span></a></p>
                <p style=\\"text-indent:-4em;duokan-text-indent:-4em;padding-left:4em\\">阅读器：请使用<a href=\\"http://www.duokan.com/product\\"><span style=\\"color:#fff\\">多看阅读</span></a>，并将翻页模式设置为“上下翻页”。</p>
              </div>
            </div>
      "
    `)
    expect(template.getCss()).toMatchInlineSnapshot(`
      "
      body {
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
        font-family: \\"微软雅黑\\", \\"黑体\\", \\"ht\\", \\"sans-serif\\";
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
        font-family: \\"gy\\", \\"DK-FANGSONG\\", \\"fs\\", \\"fangsong\\", \\"仿宋\\";
        font-weight: bold;
        font-size: 1.2em;
        text-indent: 0;
        duokan-text-indent: 0;
        text-align: center;
        line-height: 120%;
        background-color: #258;
      }
      .option {
        font-family: \\"gy\\", \\"DK-FANGSONG\\", \\"fs\\", \\"fangsong\\", \\"仿宋\\";
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
      }
      "
    `)
    expect(template.getDuokanExtension()).toMatchInlineSnapshot(`
      "
      <?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
      <duokan-extension version=\\"2.4.0\\">
        <display-options layout=\\"vertical-comic\\"/>
        <writing-options>
          <option name=\\"writing-mode\\">horizontal-tb</option>
          <option name=\\"direction\\">ltr</option>
        </writing-options>
      </duokan-extension>
      "
    `)
  })
})