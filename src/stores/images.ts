import { defineStore } from 'pinia'

export const useImages = defineStore('images', {
  state: () => {
    return {
      images: [] as { name: string; url: string }[],
      cover: '',
    }
  },
})