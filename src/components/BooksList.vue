<template>
  <a-table :columns="columns" :data-source="booksData" rowKey="title">
    <img slot="cover" slot-scope="cover" :src="cover" width="150"/>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="
          tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'
        "
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="book" slot-scope="book">
      <a-button type="primary" :disabled="!readAble" @click='open(book)'>阅读</a-button>
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
    dataIndex: "book",
    key: "book",
    slots: { title: "book" },
    scopedSlots: { customRender: "book" },
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