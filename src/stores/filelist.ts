import { defineStore } from 'pinia'

export const useFileList = defineStore('filelist', {
  state: () => ({
    files: [] as File[],
    index: {} as { [key: string]: string },
  }),
})