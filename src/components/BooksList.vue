<template>
  <a-table :columns="columns" :data-source="booksData" rowKey="id" size='small'>
    <img slot="cover" slot-scope="cover" :src="cover" width="200"/>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="path" slot-scope="path">
      <a-button type="primary" :disabled="!readAble" @click='open(path)'>阅读</a-button>
    </span>
  </a-table>
</template>

<script>
const columns = [
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    slots: { title: "cover" },
    scopedSlots: { customRender: "cover" },
  },
  {
    title: "书名",
    dataIndex: "title",
    key: "title",
    // slots: { title: 'customTitle' },
    // scopedSlots: { customRender: 'name' },
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "操作",
    dataIndex: "path",
    key: "path",
    slots: { title: "path" },
    scopedSlots: { customRender: "path" },
  },
];

export default {
  data() {
    return {
      columns
    };
  },
  props: ["booksData",'readAble'],
  methods:{
    open(book){
      this.$emit('bookReader',book)
    }
  }
};
</script>

<style>
</style>