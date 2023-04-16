<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        <q-btn
          dense
          text="var-primary"
          bg="white"
          m="r-10"
          @click="clickInputBtn"
        >
          <div
            class="i-bi:plus-square-dotted"
            w="20"
            h="20"
            m="r-5"
          />
          添加
          <q-tooltip
            :offset="[10, 10]"
            text="#fff"
            bg="var-secondary"
          >
            添加图片
          </q-tooltip>
        </q-btn>
        <q-btn
          dense
          text="#fff"
          bg="red"
          m="r-10"
          @click="clearImages"
        >
          <div
            class="i-bi:trash"
            w="20"
            h="20"
            m="r-5"
          />
          清空
          <q-tooltip
            :offset="[10, 10]"
            text="#fff"
            bg="var-secondary"
          >
            清空图片
          </q-tooltip>
        </q-btn>
        <q-btn
          dense
          text="#fff"
          bg="#26A69A"
          m="r-10"
          @click="beforeBuild"
        >
          <div
            class="i-bi:save"
            w="20"
            h="20"
            m="r-5"
          />
          保存
          <q-tooltip
            :offset="[10, 10]"
            text="#fff"
            bg="var-secondary"
          >
            保存EPUB
          </q-tooltip>
        </q-btn>
      </q-toolbar-title>
      <q-btn
        dense
        flat
        round
        @click="toggleRightDrawer"
      >
        <div
          class="i-ic:baseline-menu"
          w="20"
          h="20"
        />
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useMeta, volume } from 'src/composables/use-meta'
import { useCover, useImages, useContents, setContents, clearContents } from 'src/composables/use-images'
import { importing, generating, payload } from 'src/composables/use-loading'
import { isEmptyString, isNotEmptyString, isVoid, strRandom } from '@taiyuuki/utils'
import { alertDilog, alertNotify } from 'src/utils/notify'
import { getFileExt, getFileName, getMinetype } from 'src/utils'
import { invoke, convertFileSrc } from '@tauri-apps/api/tauri'
import { exists } from '@tauri-apps/api/fs'
import { showDrawer } from 'src/composables/use-drawer'
import { open } from '@tauri-apps/api/dialog'
import { useOptions } from 'src/composables/use-options'
import { listen } from '@tauri-apps/api/event'
import type { Event } from '@tauri-apps/api/event'

const meta = useMeta()
const images = useImages()
const contents = useContents()
const cover = useCover()
const { confoundingXhtml, confoundingImage, output } = useOptions()

// 添加图片
const addImages = (files: string[]) => {
  files.forEach((localPath) => {
    const url = convertFileSrc(localPath)
    images.push({
      name: getFileName(localPath),
      url,
      path: localPath,
    })
  })
  setContents()
  importing.value = false
}

// 导入图片
const clickInputBtn = async () => {
  const files = await open({
    title: '添加图片',
    multiple: true,
    filters: [{
      name: 'image',
      extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'tif', 'tiff'],
    }],
  })
  if (isVoid(files)) {
    return
  }
  importing.value = true
  setTimeout(() => {
    addImages(files as string[])
  }, 50)
}

// 清空图片
const clearImages = () => {
  images.length = 0
  meta.images.length = 0
  clearContents()
}

// 生成epub
const build = async () => {
  if (meta.title.trim() === '') {
    meta.title = 'example'
  }
  if (meta.author.trim() === '') {
    meta.author = 'unknown'
  }
  if (meta.creator.trim() === '') {
    meta.creator = 'elepub'
  }

  const outputIsNone = isEmptyString(output.value)
  const folderExists = await exists(output.value)
  if (!folderExists || outputIsNone) {
    const dir = await open({ directory: true, title: '请选择保存目录' })
    if (isVoid(dir)) {
      return
    }
    output.value = dir as string
  }
  meta.cover = {
    title: 'Cover',
    index: true,
    name: cover.value.name,
    path: cover.value.path,
    xhtml: 'cover.xhtml',
    mime: getMinetype(cover.value.name),
  }
  meta.images.length = 0
  images.forEach((image, i) => {
    const index = i in contents
    const title = index ? contents[i] : `P${i + 1}`
    const name = confoundingImage.value ? `*?${strRandom(12, 16)}.${getFileExt(image.name)}` : image.name
    const xhtml = confoundingXhtml.value ? `*?${strRandom(12, 16)}.xhtml` : `P${i + 1}.xhtml`
    const path = image.path
    const mime = getMinetype(image.name)
    meta.images.push({
      title,
      index,
      name,
      xhtml,
      path,
      mime,
    })
  })
  const time = Date.now()
  generating.value = true
  meta.output = `${output.value}\\${meta.title}`
  if (isNotEmptyString(volume.value)) {
    meta.volume = ` (#${volume.value})`
    meta.output += ` ${volume.value}`
  }
  meta.output += '.epub'
  await invoke('get_meta', { meta: toRaw(toRaw(meta)) })
  const cost = (Date.now() - time) / 1000
  generating.value = false
  alertNotify(`完成，耗时${cost.toFixed(0)}秒`, 'positive')
  payload.value = 0
}

const beforeBuild = () => {
  if (isEmptyString(cover.value.path)) {
    if (images.length === 0) {
      return alertNotify('请添加图片', 'negative')
    }
    alertDilog(
      '提示',
      '没有选择封面，默认以第一张图作为封面，是否继续？',
      () => {
        cover.value = JSON.parse(JSON.stringify(images[0]))
        build()
      }
    )
  }
  else {
    build()
  }
}

// 控制显示侧边栏
const toggleRightDrawer = () => {
  showDrawer.value = !showDrawer.value
}

onMounted(() => {
  listen('progress', (e: Event<number>) => {
    payload.value = e.payload * 100
  })
})
</script>