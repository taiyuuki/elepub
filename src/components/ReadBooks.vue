<template>
  <div class="books">
    <!-- <a-button
      class="return-back"
      type="primary"
      @click="$router.push('/')"
      icon="left-circle"
      >返回</a-button
    > -->
    <a-tooltip>
      <template slot="title">
        只支持由本工具生成的漫画，用于测试生成效果，导入其他EPUB会发生错误。</template
      >
      <a-button icon="upload" @click="inputBtn">导入漫画</a-button>
    </a-tooltip>

    <a-button
      class="creator-btn"
      type="primary"
      icon="tool"
      @click="toggleToCreatePage"
      >制作EPUB</a-button
    >

    <input
      type="file"
      multiple="true"
      style="display: none"
      ref="intf"
      @change="inputCmoic"
      accept=".epub"
    />
    <div class="spin-content" v-if="isLoading">
      <a-spin class="load-item" tip="Loading..."> </a-spin>
    </div>
    <BooksList
      :booksData="booksData"
      :readAble="readAble"
      @bookReader="bookReader"
      @remove="remove"
    ></BooksList>
  </div>
</template>

<script>
import BooksList from "./BooksList.vue";
const { compress, decompress } = require("shrink-string");
const fs = require("fs");
const EPub = require("epub");
export default {
  name: "read-books",
  data() {
    return {
      booksData: [],
      readAble: true,
      headers: {
        authorization: "authorization-text",
      },
      isLoading: false,
    };
  },
  methods: {
    bookReader(book) {
      this.$router.push({
        name: "bookReader",
        //params和path不能一起使用，这里用name
        params: {
          book,
        },
      });
    },
    toggleToCreatePage() {
      this.$router.push({
        name: "bookCreator",
        params: {
          rt: "/",
        },
      });
    },
    async remove(path) {
      let j = 0;
      while (this.booksData[j].path !== path) {
        j++;
      }
      this.booksData.splice(j, 1);
      let saveData = JSON.stringify(this.booksData);
      let ws = fs.createWriteStream("./data.ele");
      let shrunk = await compress(saveData);
      ws.write(shrunk);
      ws.end();
    },
    getEPuB(file) {
      let path = file.path;
      let book = new EPub(path);
      book.parse();
      let temp = {
        id: file.lastModified,
        fileName: file.name,
        title: "",
        author: "",
        cover: "",
        path: "",
      };
      return new Promise((resolve,reject) => {
        book.on("end", () => {
          temp.path = book.filename;
          temp.title = book.metadata.title;
          temp.author = book.metadata.creator;
          book.getImage("cover-image", (err, img, type) => {
            if (err) {
              reject(err);
            }
            temp.cover = `data:${type};base64,${img.toString("base64")}`;
            resolve(temp);
          });
        });
      });
    },
    inputBtn() {
      this.$refs.intf.click();
    },
    async inputCmoic(e) {
      this.isLoading = true;
      let files = Array.from(e.target.files);
      for (let i in files) {
        if (
          files[i].path.search(/.epub$/g) === -1 ||
          this.booksData.some((j) => j.path === files[i].path)
        ) {
          continue;
        }
        await this.getEPuB(files[i]).then((temp) => {
          this.booksData.unshift(temp);
        });
      }
      //保存数据
      let saveData = JSON.stringify(this.booksData);
      let ws = fs.createWriteStream("./data.ele");
      let shrunk = await compress(saveData);
      ws.write(shrunk);
      ws.end();
      this.isLoading = false;
    },
  },
  mounted() {
    this.isLoading = true;
    new Promise(function (resolve, reject) {
      fs.readFile("./data.ele", function (err, data) {
        if (err) {
          this.isLoading = false;
          reject(err);
        }
        resolve(data);
      });
    }).then(
      async (data) => {
        let loadData = await decompress(data.toString());
        this.booksData = JSON.parse(loadData);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  },
  components: { BooksList },
};
</script>

<style scoped>
.books {
  padding: 20px;
  width: 100%;
  text-align: left;
}
.return-back {
  margin: 0 30px 30px 3px;
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
.creator-btn {
  margin-left: 30px;
}
</style>