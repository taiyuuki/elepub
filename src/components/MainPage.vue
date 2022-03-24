<template>
  <div class="main">
    <div class="search">
          <a-tooltip>
      <template slot="title">
        这个目前只是个摆设</template
      >
            <a-input-search
        placeholder="在线搜索"
        enter-button
        @search="onSearch"
        v-model="keyword"
        class="input"
      />
    </a-tooltip>

      <div>
        <a-button type="primary" @click="$router.push('/books')" icon="database"
          >本地书籍</a-button
        >
      </div>
      <a-button
        class="creator-btn"
        type="primary"
        icon="tool"
        @click="toggleToCreatePage"
        >制作EPUB</a-button
      >
      <div></div>
    </div>
    <BooksList :booksData="booksData" :readAble="readAble" />
  </div>
</template>

<script>
const axios = require("axios");

import BooksList from "./BooksList.vue";

export default {
  name: "main-page",
  data() {
    return {
      keyword: "",
      maxIdx: 0,
      count: 20,
      booksData: [],
      openBtn: {},
      readAble: false,
    };
  },
  methods: {
    onSearch() {
      let url = `https://weread.qq.com/web/search/global?keyword=${this.keyword}&maxIdx=${this.maxIdx}&fragmentSize=120&count=${this.count}`;
      axios.get(url).then((res) => {
        let books = res.data.books;
        let data = [];
        books.forEach((item) => {
          let book = {};
          book.title = item.bookInfo.title;
          book.cover = item.bookInfo.cover;
          book.author = item.bookInfo.author;
          data.push(book);
        });
        this.booksData = [...data];
      });
    },
    toggleToCreatePage(){
      this.$router.push({
        name: "bookCreator",
        params: {
          rt: '/'
        }
      })
    }
  },
  components: { BooksList },
};
</script>

<style scoped>
.main {
  padding: 20px;
}
.search {
  margin: 0 auto 30px auto;
  width: 600px;
  display: flex;
  justify-content: space-around;
}

.input {
  margin: 0 30px;
}

.creator-btn{
  margin-left:30px;
}
</style>