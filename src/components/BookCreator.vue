<template>
  <div class="creator">
    <div class="spin-content" v-if="isCreating">
      <a-spin class="load-item" tip="正在生成..."> </a-spin>
    </div>
    <a-button
      class="return-back"
      type="primary"
      @click="$router.push(returnRouter)"
      icon="left-circle"
      >返回</a-button
    >
    <div id="panel">
      <div id="holder">
        <a-tooltip>
          <template slot="title"> 导入漫画图片，请一定要事先排好顺序</template>
          <a-button icon="upload" @click="inputImagesBtn">导入图片</a-button>
        </a-tooltip>

        <input
          type="file"
          multiple="multiple"
          style="display: none"
          ref="inti"
          accept="image/*"
          @change="selectImages"
        />

        <a-tooltip>
          <template slot="title"> 清空已导入的图片</template>
          <a-button type="danger" @click="clearAll">清空</a-button>
        </a-tooltip>

        <a-tooltip>
          <template slot="title"
            >标记每话的第一张图，比如在文件名后添加“_C”，epub会在标记处自动分章，默认（留空）每一页就是一章。</template
          >
          <a-input
            id="regx"
            placeholder="输入你设置的标记"
            size="middle"
            v-model="firstPage"
          />
        </a-tooltip>
        <div id="comic-previe">
          <div
            class="image-box"
            v-for="(item, i) in comicPreview"
            :key="'images' + i"
          >
            <img :src="item" />
            <p id="page-number">{{ ++i }}</p>
          </div>
        </div>
      </div>
      <div id="message">
        <div id="cover">
          <div id="preview" v-html="coverPreview.src"></div>
          <a-button icon="upload" @click="slCoverBtn">选择封面</a-button>
          <input
            type="file"
            style="display: none"
            ref="intc"
            accept="image/*"
            @change="selectCover"
          />
        </div>
        <div id="meta">
          <a-tooltip>
            <template slot="title">书名 必填</template>
            <a-input placeholder="书名" v-model="metadata.title" />
          </a-tooltip>

          <a-tooltip>
            <template slot="title"> 作者，必填</template>
            <a-input placeholder="作者" v-model="metadata.author" />
          </a-tooltip>

          <a-tooltip>
            <template slot="title"> EPUB文档制作者</template>
            <a-input placeholder="制作者" v-model="metadata.maker" />
          </a-tooltip>

          <a-tooltip>
            <template slot="title"> 集/卷，可以留空</template>
            <a-input placeholder="集/卷" v-model="metadata.sequence" />
          </a-tooltip>

          <a-tooltip>
            <template slot="title"> 出版商，可以留空</template>
            <a-input placeholder="出版商" v-model="metadata.publisher" />
          </a-tooltip>

          <a-tooltip>
            <template slot="title"> 出版日期，可以留空</template>
            <a-input placeholder="出版日期" v-model="metadata.published" />
          </a-tooltip>
        </div>

        <a-tooltip>
          <template slot="title"> 这本书开始于第几话</template>
          <a-input-number
            placeholder="开始章节"
            :min="0"
            v-model="firstChapter"
          />
        </a-tooltip>

        <a-button type="primary" @click="showModal"> 生成epub </a-button>
        <a-modal
          title="提示"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="createEPuB"
          @cancel="handleCancel"
        >
          <p>{{ ModalText }}</p>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { msgTemplate, cssTemplate } from "src/js/template.js";
const nodepub = require("nodepub");
let epub;

export default {
  name: "BookCreator",
  data() {
    return {
      coverPreview: {
        img: "",
        path: "",
      },
      returnRouter:'/',
      visible: false,
      confirmLoading: false,
      comicPreview: [],
      firstChapter: 1,
      ModalText: "",
      isCreating: false,
      firstPage: "",
      metadata: {
        id: "",
        cover: "",
        title: "", //书名
        sequence: "", //丛书序号
        author: "", //作者
        maker: "",
        publisher: "", //出版商
        published: "", //出版日期
        language: "zh", //语言
        showContents: false, //是否展示目录
        images: [], //图片
        deleteDirty: true, //是否删除原模块中多余的代码
        duokanComic: true, //是否制作成多看滚动漫画
      },
    };
  },
  mounted(){
    this.returnRouter = this.$route.params.rt;
  },
  methods: {
    showModal() {
      this.visible = true;
      if (
        this.metadata.cover === "" ||
        this.metadata.title === "" ||
        this.metadata.author === ""
      ) {
        this.ModalText = "封面、书名、作者不能为空";
      } else {
        this.ModalText = "将生成EPuB格式的多看漫画（条漫），是否继续？";
      }
    },
    handleCancel() {
      this.visible = false;
    },
    slCoverBtn() {
      this.$refs.intc.click();
    },
    selectCover(e) {
      let file = e.target.files[0];
      this.coverPreview = {
        src: `<img src=${URL.createObjectURL(
          file
        )} alt='cover' style='width:100%'/>`,
        path: file.path,
      };
      this.metadata.cover = file.path;
    },
    inputImagesBtn() {
      this.$refs.inti.click();
    },
    selectImages(e) {
      let files = Array.from(e.target.files);
      for (let f in files) {
        if (files[f].type.search(/^image/) === -1) {
          continue;
        } else {
          this.metadata.images.push(files[f].path);
          this.comicPreview.push(URL.createObjectURL(files[f]));
        }
      }
    },
    clearAll() {
      this.comicPreview = [];
      this.metadata.images = [];
    },
    getBookId() {
      function getRandom(digit) {
        let result = "";
        for (let i = 1; i <= digit; i++) {
          result += Math.floor(Math.random() * 16).toString(16);
        }
        return result;
      }
      return `urn:uuid:${getRandom(8)}-${getRandom(4)}-${getRandom(
        4
      )}-${getRandom(4)}-${getRandom(12)}`;
    },
    getHtmlSection() {
      return new Promise((resolve) => {
        let count = this.firstChapter;
        this.metadata.images.forEach((item, i) => {
          let regM = new RegExp(this.firstPage);
          let fileName = this.getFileName(item);
          if (!(this.firstPage === "")) { 
            if (regM.test(fileName)) {
              epub.addSection(
                `第${count}话`,
                `<img alt='${fileName}' src='../images/${fileName}'/>`,
                false,
                false,
                `P${i + 1}`
              );
              count++;
            } else {
              epub.addSection(
                `P${i + 1}`,
                `<img alt='${fileName}' src='../images/${fileName}'/>`,
                true,
                false,
                `P${i + 1}`
              );
            }
          } else {
            epub.addSection(
              `P${i + 1}`,
              `<img alt='${fileName}' src='../images/${fileName}'/>`,
              false,
              false,
              `P${i + 1}`
            );
          }
        });
        resolve();
      });
    },
    async outputEpub() {
      this.isCreating = true;
      this.metadata.id = this.getBookId();
      epub = nodepub.document(this.metadata);

      epub.addCSS(cssTemplate);
      epub.addSection("说明", msgTemplate, false, false, "msg");
      await this.getHtmlSection();
      if (this.metadata.sequence === "") {
        await epub.writeEPUB("./EPUB", `[多看漫画]${this.metadata.title}`);
      } else {
        await epub.writeEPUB(
          "./EPUB",
          `[多看漫画]${this.metadata.title} ${this.metadata.sequence}`
        );
      }
      this.isCreating = false;
      this.$notification.open({
        message: '已完成',
        description:`生成的文件放在根目录EPUB文件夹内`,
        icon: <a-icon type="message" style="color: #108ee9" />,       
      });
    },
    createEPuB() {
      this.visible = false;
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
      if (
        this.metadata.cover === "" ||
        this.metadata.title === "" ||
        this.metadata.author === ""
      ) {
        return -1;
      } else {
        this.outputEpub();
      }
    },
    getFileName(path) {
      let pos1 = path.lastIndexOf("/");
      let pos2 = path.lastIndexOf("\\");
      let pos = Math.max(pos1, pos2);
      if (pos < 0) return path;
      else return path.substring(pos + 1);
    },
  },
};
</script>

<style>
.return-back {
  margin: 0 30px 30px 3px;
}
.creator {
  padding: 20px;
  width: 100%;
  text-align: left;
}
#panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  justify-items: left;
}
.image-box {
  position: relative;
  font-size: 0;
  line-height: 1em;
}

.image-box img {
  width: 100%;
}

#page-number {
  text-align: center;
  font-size: 16px;
  text-indent: 0;
  width: 45px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 2px;
  position: absolute;
  bottom: 15px;
  left: 45%;
  bottom: 5px;
  line-height: 30px;
}

#holder button {
  margin: 0px 20px 20px 0;
}

#comic-previe {
  width: 400px;
  height: 600px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  font-size: 0;
  text-align: center;
  line-height: 500px;
  color: #fff;
  font-size: 16px;
  overflow: scroll;
  vertical-align: sub;
}

#clear-image {
  margin: 20px auto;
  width: 100px;
  height: 20px;
}

#message {
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 5px;
  max-width: 1080px;
}

#meta input {
  display: block;
}

#preview {
  width: 150px;
  height: 250px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  margin: 10px;
  box-shadow: 1px 1px 3px #000;
}
.spin-content {
  text-align: center;
  border: 1px solid #91d5ff;
  background-color: rgba(230, 247, 255, 0.5);
  width: 100%;
  height: 1000%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.load-item {
  margin-top: 30%;
}
#regx {
  width: 180px;
  display: inline;
}
</style>