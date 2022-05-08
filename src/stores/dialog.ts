import { defineStore } from 'pinia';

export const useDialog = defineStore('dialog', {
  state: () => {
    return {
      barText: '提示',
      title: '',
      text: '',
      bar: false,
    };
  },
});
