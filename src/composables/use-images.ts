import { is_empty_obj, object_keys, throttle } from '@taiyuuki/utils'
import { chapterMode, firstPage, pageCount, firstChapter } from './use-options'

interface ImageFile {
    path: string
    name: string
    url: string
}

const cover = ref<ImageFile>({
    path: '',
    name: '',
    url: '',
})

const images = reactive<ImageFile[]>([])

const contents = reactive<Record<string, string>>({})

export function useCover() {
    return cover
}

export function useImages() {
    return images
}

export function useContents() {
    return contents
}

// 清空目录
export function clearContents() {
    const kyes = object_keys(contents)
    kyes.forEach(key => {
        delete contents[key]
    })
}

// 移除目录
export function removeContentsItem(i: string | number) {
    delete contents[i]
}

let mode_1 = true // 默认
let mode_2 = false// 按标记
let mode_3 = false// 按页数

export function setContentsMode() {
    mode_1
    = chapterMode.value === 'default'
    || (chapterMode.value === 'mark' && firstPage.value.trim().length === 0)
    mode_2
    = chapterMode.value === 'mark' && firstPage.value.trim().length > 0
    mode_3 = chapterMode.value === 'count' && pageCount.value !== 1
}

export function setContent(file: ImageFile, i: number, count: number) {
    if (mode_1) {
        contents[i] = `P${i + 1}`
    }
    else if (mode_2) {
        const regM = new RegExp(firstPage.value)
        const check = regM.test(file.name)
        if (check) {
            contents[i] = `第${count.toFixed(0)}话`
            return true
        }
    }
    else if (mode_3) {
        if (i % pageCount.value === 0) {
            const count = Number(pageCount.value)
            let title = `P${i + 1}-P${i + count}`
            const length = images.length
            if (i + count >= length) {
                title = `P${i + 1}-P${length}`
            }
            contents[i] = title
        }
    }
}

export function setContents() {
    setContentsMode()
    if (!is_empty_obj(contents)) {
        clearContents()
    }
    let count = Number(firstChapter.value)
    images.forEach((image, i) => {
        if (setContent(image, i, count)) {
            count++
        }
    })
}

export const triggerSetContents = throttle(setContents, 500)
