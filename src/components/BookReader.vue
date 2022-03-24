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
      <a-spin id="loading" size="large" v-show="content === ''" />
      <div id="contents" v-html="content"></div>
      <div id="index">
        <template v-for="(item, i) in book.flow">
          <a-menu
            v-if="item.title && subSection(item, i)"
            mode="inline"
            style="width: 150px"
            :key="item.title + i"
          >
            <a-menu-item :key="i" @click="toggle(item, i)" :disabled="useable">
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
const EPub = require("epub");
export default {
  name: "book-reader",
  mounted() {
    document.documentElement.scrollTop = 0;
    this.count = 0;
    this.book = new EPub(this.$route.params.book);
    this.book.on("end", () => {
      this.book.getImage("cover-image", (err, img, type) => {
        if (err) {
          throw err;
        }
        this.cover = `data:${type};base64,${img.toString("base64")}`;
        this.content = `<img style="width:100%;max-width:720px;" src="${this.cover}"/>`;
      });
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
    });
    try {
      this.book.parse()
    } catch {
      this.$notification.open({
        message: "打开失败",
        description: `文件已经被移除或文件路径被更改`,
        icon: <a-icon type="warning" style="color: #108ee9" />,
      })
      this.content='打开失败'
    }
  },
  data() {
    return {
      cover: "",
      content: "",
      book: {},
      images: [],
      chapters: [],
      count: 0,
      css: "",
      useable: false,
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
      this.useable = true;
      document.documentElement.scrollTop = 0;
      this.content = "";
      if (item.title.search(/(C|c)over/) !== -1) {
        this.content = `<img style="width:100%;max-width:720px;" src="${this.cover}"/>`;
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
      this.useable = false;
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
  justify-items: center;
}
#loading {
  margin-top: 30%;
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