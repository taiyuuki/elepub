<template>
  <div class="books">
    <a-button
      class="return-back"
      type="primary"
      @click="$router.push('/')"
      icon="left-circle"
      >返回</a-button
    >
    <BooksList :booksData="booksData" :readAble="readAble" @bookReader='bookReader'></BooksList>
  </div>
</template>

<script>
import BooksList from "./BooksList.vue";
const fs = require("fs");
const EPub = require("epub");
export default {
  name: "read-books",
  data() {
    return {
      booksData:[],
      readAble: true
    };
  },
  methods:{
    bookReader(book){
      this.$router.push({
        name: 'bookReader',
        //params和path不能一起使用，这里用query
        params:{
          book
        }
      })
    }
  },
  mounted() {
    this.isLoading = true;
    let files = fs.readdirSync("Library");
    let tempData = [];
    let p = new Promise((resolve) => {
      files.forEach((file) => {
        let book = new EPub("Library/" + file);
        let data = {
          title: "",
          cover: "",
          author: "",
          book:book
        };
        book.on("end", () => {
          data.title = book.metadata.title;
          data.author = book.metadata.creator;
          book.getImage("cover-image", (err, img, type) => {
            if (err) {
              throw err;
            }
            data.cover = `data:${type};base64,${img.toString("base64")}`;
            data.book.cover = data.cover;
            tempData.push(data);
          });
        });
        book.parse();
      });
      resolve(tempData);
    });
    p.then((tempData) => {
      this.booksData = tempData;
    });
  },
  components: { BooksList},
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