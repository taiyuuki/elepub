<template>
  <div>
    <a-empty style="margin-top: 30%" v-if="booksData.length === 0" />
    <a-card
      hoverable
      style="width: 240px; float: left; margin: 5px; cursor: auto"
      v-for="item in booksData"
      :key="item.id"
    >
      <a-tooltip>
        <template slot="title"> 移除</template>
        <div
          class="close-btn"
          v-show="readAble"
          @click.stop="remove(item.path)"
          style="cursor: pointer"
        >
          X
        </div>
      </a-tooltip>
      <a-dropdown :trigger="['contextmenu']">
        <div class="cover-image" @click="open(item.path)">
          <a-tooltip>
            <template slot="title"> {{ item.title }}</template>
            <img :alt="item.cover" :src="item.cover" style="width: 100%" />
          </a-tooltip>
        </div>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="open(item.path)"> 阅读 </a-menu-item>
          <a-menu-item key="2" @click="remove(item.path)"> 移除 </a-menu-item>
          <a-menu-item key="3" @click="openFolder(item.path)">
            打开文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-card-meta
        :title="item.title"
        style="margin-top: 5px; height: 3em; text-overflow: ellipsis"
      >
        <template slot="description">{{ item.author }} </template>
      </a-card-meta>
    </a-card>
  </div>
</template>


<script>
const exec = require("child_process").exec;
export default {
  data() {
    return {
      showAble: false,
    };
  },
  props: ["booksData", "readAble"],
  methods: {
    open(book) {
      this.$emit("bookReader", book);
    },
    remove(path) {
      this.$emit("remove", path);
    },
    openFolder(folder) {
      try {
        exec(`explorer.exe /select,"${folder}"`);
      } catch {
        this.$notification.open({
          message: "打开失败",
          description: `文件已经被移除或文件路径被更改`,
          icon: <a-icon type="warning" style="color: #108ee9" />,
        });
        this.content = "打开失败";
      }
    },
  },
};
</script>

<style>
.cover-image {
  box-sizing: border-box;
  width: 200px;
  height: 300px;
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>