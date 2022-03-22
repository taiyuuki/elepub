<template>
  <div class="book-reader">
    <div v-html="css"></div>
    <a-button
      class="return-back"
      type="primary"
      @click="$router.push('/books')"
      icon="left-circle"
      >返回</a-button
    >
    <div id="display-area">
      <div id="contents" v-html="content"></div>
      <div id="index">
        <template v-for="(item, i) in book.flow">
          <a-menu
            v-if="item.title && subSection(item, i)"
            mode="inline"
            style="width: 150px"
            :key="item.title + i"
          >
            <a-menu-item :key="i" @click="toggle(item, i)">
              <span><a-icon type="flag" /></span>
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "book-reader",
  mounted() {
    this.count = 0;
    this.book = this.$route.params.book;
    this.content = `<img style="width:100%;max-width:720px;" src="${this.book.cover}"/>`;
    let j = 0;
    for (let key in this.book.manifest) {
      if (this.book.manifest[key]["media-type"].search(/image/) !== -1) {
        this.images[j] = this.book.manifest[key].id;
        j++;
      }
    }
    this.book.getFile("css", (err, data) => {
      if (err) {
        return;
      }
      this.css = `<style>${data.toString()}</style>`;
    });
  },
  data() {
    return {
      content: "",
      book: {},
      images: [],
      chapters: [],
      count: 0,
      css:''
    };
  },
  methods: {
    subSection(item, i) {
      if (this.count !== -1) {
        if (this.count > i) {
          this.chapters[this.count - 1].end = this.book.flow.length - 1;
          this.count = -1;
        } else if (item.id !== "s1" && item.title.search(/(C|c)over/) === -1) {
          if (this.count !== 0) {
            this.chapters[this.count - 1].end = i - 1;
          }
          this.chapters[this.count] = {
            start: 0,
            end: 0,
          };
          this.chapters[this.count].start = i;
          this.count++;
        }
      }
      return item.title;
    },
    async toggle(item, i) {
      document.documentElement.scrollTop  = 0;     
      this.content = "";
      if (item.title.search(/(C|c)over/) !== -1) {
        this.content = `<img style="width:100%;max-width:720px;" src="${this.book.cover}"/>`;
      } else if (item.id === "s1") {
        this.book.getChapter("s1", (err, text) => {
          if (err) throw err;
          this.content = text.toString();
        });
      } else {
        let index = 0;
        for (let j in this.images) {
          if (this.chapters[j].start === i) {
            index = j;
            break;
          }
        }
        for (
          let k = this.chapters[index].start;
          k <= this.chapters[index].end;
          k++
        ) {
          await this.getImages(this.images[k - 1]).then((src) => {
            this.content += `<img style="width:100%;max-width:720px;" src="${src}"/>`;
          });
        }
      }
    },
    getImages(id) {
      return new Promise((resolve) => {
        this.book.getImage(id, (err, img, type) => {
          let src = "";
          if (err) {
            throw err;
          }
          src = `data:${type};base64,${img.toString("base64")}`;
          resolve(src);
        });
      });
    },
  },
};
</script>

<style scoped>
.book-reader {
  text-align: center;
  text-indent: 0;
  padding: 10px;
}
.return-back {
  margin: 0 30px 30px 3px;
  position: fixed;
  left: 0;
  top: 40px;
}
#display-area {
  display: grid;
  grid-template-columns: 1fr 150px;
  justify-items:center;
}
#index {
  position: fixed;
  width: 150px;
  right: 0;
  top: 0;
  padding-top: 50px;
  overflow: scroll;
  height: 100%;
  background-color: #fff;
}

#contents {
  vertical-align: sub;
  width: 100%;
  max-width: 720px;
  text-align: center;  
}

#contents img {
  width: 100%;
}
</style>