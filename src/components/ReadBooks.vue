<template>
  <div class="books">
    <a-button
      class="return-back"
      type="primary"
      @click="$router.push('/')"
      icon="left-circle"
      >返回</a-button
    >

    <a-button icon="upload" @click="inputBtn">导入漫画</a-button>
    <input
      type="file"
      multiple="true"
      style="display: none"
      ref="intf"
      @change="inputCmoic"
    />

    <BooksList
      :booksData="booksData"
      :readAble="readAble"
      @bookReader="bookReader"
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
      return new Promise((resolve) => {
        book.on("end", () => {
          temp.path = book.filename;
          temp.title = book.metadata.title;
          temp.author = book.metadata.creator;
          book.getImage("cover-image", (err, img, type) => {
            if (err) {
              throw err;
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
      let files = Array.from(e.target.files);
      for (let item in files) {
        await this.getEPuB(files[item]).then((temp) => {
          this.booksData.push(temp);
        });
      }
      //保存数据
      let saveData = JSON.stringify(this.booksData);
      let ws = fs.createWriteStream("temp_data/data.ele");
      let shrunk = await compress(saveData);
      ws.write(shrunk);
      ws.end();
    },
  },
  mounted() {
    new Promise(function(resolve) {
      fs.readFile("temp_data/data.ele", function(err,data) {
        if (err) return;
        resolve(data);
      });
    }).then(async (data) => {
      let loadData = await decompress(data.toString());
      this.booksData = JSON.parse(loadData)
    });
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
</style>