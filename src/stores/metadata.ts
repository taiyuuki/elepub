import { defineStore } from 'pinia'
import { genUuid } from 'src/factory/utils'
import type { EpubImage } from 'wepub'

export const useMetadata = defineStore('metadata', {
  state: () => ({
    id: 'urn:uuid:1270001',
    cover: {} as EpubImage, // 封面图片
    title: '', // 书名
    series: '', // 系列丛书
    sequence: '', // 丛书序号
    author: '', // 作者
    publisher: '', // 出版商
    published: '', // 出版日期
    description: '', // 描述信息
    language: 'zh-CN',
    genre: '',
    tags: '',
    showContents: false, // 是否展示目录
    contents: '目录',
    images: [] as EpubImage[], // 图片
    maker: '',
  }),
  actions: {
    resetId() {
      this.id = genUuid()
    },
  },
})