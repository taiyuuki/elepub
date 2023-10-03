import { storage_get, storage_set } from '@taiyuuki/utils'

export const confoundingImage = ref(false)
export const confoundingXhtml = ref(false)
export const chapterMode = ref('default')
export const firstChapter = ref(1)
export const pageCount = ref(10)
export const firstPage = ref('')
export const output = ref('')

export function useOptions() {
    onMounted(() => {
        output.value = storage_get('output') || ''
    })

    watch(output, (value) => {
        storage_set('output', value)
    })
    return {
        confoundingImage, confoundingXhtml, chapterMode, firstChapter, pageCount, firstPage, output,
    }
}
