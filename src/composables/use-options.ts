import { storageGet, storageSet } from '@taiyuuki/utils'

const confoundingImage = ref(false)
const confoundingXhtml = ref(false)
const chapterMode = ref('default')
const firstChapter = ref(1)
const pageCount = ref(10)
const firstPage = ref('')
const output = ref<string>(storageGet('output', ''))

export function useOptions() {
  return {
    confoundingImage, confoundingXhtml, chapterMode, firstChapter, pageCount, firstPage, output,
  }
}

watch(output, (value) => {
  storageSet('output', value)
})