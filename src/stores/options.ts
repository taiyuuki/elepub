import { defineStore } from 'pinia';

export const useOptions = defineStore('options', {
  state: () => {
    return {
      confoundingImage: false,
      confoundingXhtml: false,
      chapterMode: 'default',
      firstChapter: 1,
      pageCount: 10,
      firstPage: '',
    };
  },
});
