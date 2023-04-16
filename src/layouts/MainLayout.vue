<template>
  <div
    v-if="isCreating"
    pst="fix t-0 l-0"
    w="100vw"
    h="100vh"
    bg="#00000088"
    z-index="3001"
    flex="row items-center"
  >
    <q-circular-progress
      show-value
      font-size="24px"
      :value="progress"
      size="120px"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"
      class="q-ma-md"
      style="margin: auto; color: #fff"
    >
      <span v-if="progress < 100">{{ progress }}%</span>
      <span
        v-else
        text="16"
      >保存中...</span>
    </q-circular-progress>
  </div>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            dense
            color="white"
            text-color="primary"
            m="r-10"
            @click="clickInputBtn"
          >
            <div
              class="i-bi:plus-square-dotted"
              w="20"
              h="20"
              m="r-5"
            />
            <input
              ref="input"
              type="file"
              accept="image/jpg,image/png,image/jpeg"
              multiple
              display="none"
              @change="importImages"
            >
            添加
            <q-tooltip
              :offset="[10, 10]"
              text="#fff"
              bg="secondary"
            >
              添加图片
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            color="red"
            text="#fff"
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
              bg="secondary"
            >
              清空图片
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            color="secondary"
            text="#fff"
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
              bg="secondary"
            >
              保存epub
            </q-tooltip>
          </q-btn>
          <span
            v-if="!isElectron()"
            class="gt-sm"
          ><a
            href="https://github.com/taiyuuki/elepub"
            target="_blank"
            class="text-#fff text-20 text-nounderline hover:text-shadow-#fff-5px"
          >获取桌面版(Windows)</a></span>
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

    <q-drawer
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      bordered
      overlay
      :width="280"
      persistent
      :breakpoint="792"
      overflow-hidden
    >
      <SetMeta @change-mode="triggerChangeContentsMode" />
    </q-drawer>

    <q-page-container>
      <PreviewContent
        :inputing="inputing"
        @reset-contents="setContens"
        @add-to-contents="addToContents"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useMetadata } from 'src/stores/metadata'
import { useImages } from 'stores/images'
import { getRandomName, isElectron, isEmptyObj, throttle } from 'src/factory/utils'
import { useOptions } from 'stores/options'
import { template } from 'src/factory/template'
import type { ImageFile, Metadata } from 'wepub'
import { alertDilog, alertNotify } from 'src/factory/notify'
import buildEpub from '../../src-electron/electron-wepub'
import { useFileList } from 'src/stores/filelist'

const {
  confoundingImage,
  confoundingXhtml,
  pageCount,
  firstChapter,
  chapterMode,
  firstPage,
} = storeToRefs(useOptions())

const metadata = useMetadata()
const imageState = useImages()
const input = $ref(null)
const fileList = useFileList()
let rightDrawerOpen = $ref(false)
let inputing = $ref(false)
let progress = $ref(0)
let isCreating = $ref(false)

let mode_1 = true
let mode_2 = false
let mode_3 = false

const setContentsMode = () => {
  mode_1
    = chapterMode.value === 'default'
    || (chapterMode.value === 'mark' && firstPage.value.trim().length === 0)
  mode_2
    = chapterMode.value === 'mark' && firstPage.value.trim().length > 0
  mode_3 = chapterMode.value === 'count' && pageCount.value !== 1
}

if (isElectron()) {
  window.wepubApi.getProgress((_, p) => {
    progress = Number(p.toFixed(0))
  })
}

const setContent = (file: File, i: number, count: number) => {
  if (mode_1) {
    fileList.index[i] = `P${i + 1}`
  }
  else if (mode_2) {
    const regM = new RegExp(firstPage.value)
    const check = regM.test(file.name)
    if (check) {
      fileList.index[i] = `第${count}话`
      return true
    }
  }
  else if (mode_3) {
    if (i % pageCount.value === 0) {
      let title = `P${i + 1}-P${i + Number(pageCount.value)}`
      if (i + Number(pageCount.value) >= fileList.files.length) {
        title = `P${i + 1}-P${fileList.files.length}`
      }
      fileList.index[i] = title
    }
  }
}

const setContens = () => {
  setContentsMode()
  fileList.index = {}
  let count = firstChapter.value
  fileList.files.forEach((file, i) => {
    if (setContent(file, i, count)) {
      count++
    }
  })
}

const addToContents = (i: number) => {
  fileList.index[i] = fileList.files[i].name
}

const triggerChangeContentsMode = throttle(setContens, 500)

// 添加图片
const addImages = (files: File[]) => {
  setContentsMode()
  fileList.index = {}
  fileList.files.push(...files)
  let count = firstChapter.value
  files.forEach((file: File, i) => {
    imageState.images.push({
      name: file.name,
      url: URL.createObjectURL(file),
    })
    metadata.$patch((state) => {
      if (isElectron()) {
        state.images.push({
          name: file.name,
          path: file.path,
        })
      }
      else {
        state.images.push({
          name: confoundingImage.value ? getRandomName(file.name) : file.name,
          data: file,
        })
      }
    })
    if (setContent(file, i, count)) {
      count++
    }
  })
  inputing = false
}

// 导入图片
const clickInputBtn = () => {
  if (input) {
    (<HTMLInputElement>input).click()
  }
}
const importImages = (e: Event) => {
  const oInput = e.target as HTMLInputElement
  inputing = true
  setTimeout(() => {
    const files = Array.from(oInput.files as FileList)
    addImages(files)
    oInput.value = ''
  }, 50)
}

// 清空图片
const clearImages = () => {
  imageState.images.length = 0
  metadata.images.length = 0
  fileList.files.length = 0
  fileList.index = {}
}

// 插入html
const insertImage = (imageName: string) => {
  return `<img alt='${imageName}' src='../images/${imageName}'/>`
}

// 添加section
const addSection = (epubMeta: EpubData) => {
  fileList.files.forEach((file, i) => {
    const fileName = confoundingXhtml.value ? getRandomName() : `P${i + 1}`
    let imageName = file.name
    const image = metadata.images[i]
    if (confoundingImage.value && typeof image !== 'string') {
      image.name = getRandomName(file.name)
      imageName = image.name
    }
    const insertHtml = insertImage(imageName)
    const section = {
      title: `P${i + 1}`,
      content: insertHtml,
      overrideFilename: fileName,
      excludeFromContents: true,
    }
    if (i in fileList.index) {
      section.title = fileList.index[i]
      section.excludeFromContents = false
    }
    epubMeta.sections.push(section)
  })
}

// 生成epub
const build = async () => {
  const epubMeta: EpubData = {
    images: [],
    css: '',
    customFiles: [],
    output: '',
    sections: [],
    metadata: {} as Metadata,
  }
  epubMeta.css = template.getCss()
  epubMeta.metadata = toRaw(metadata.$state)
  epubMeta.customFiles.push({
    name: 'duokan-extension.xml',
    folder: 'META-INF',
    content: template.getDuokanExtension(),
  })
  epubMeta.sections.push({
    title: '说明',
    content: template.getMessage(),
    excludeFromContents: true,
    overrideFilename: 'msg',
  })
  addSection(epubMeta)
  isCreating = true
  const fileName = metadata.sequence.trim() ? ' ' + metadata.sequence : ''
  if (isElectron()) {
    epubMeta.output = `./EPUB/${metadata.title}${fileName}.epub`
    await window.wepubApi.buildEpub(epubMeta)
    alertNotify('完成，文件保存于根目录EPUB文件夹内', 'positive')
  }
  else {
    epubMeta.output = `${metadata.title}${fileName}.epub`
    await buildEpub(epubMeta, (p) => {
      progress = Number(p.toFixed(0))
    })
    alertNotify('完成，请查看下载文件', 'positive')
  }
  isCreating = false
  progress = 0
}

const beforeBuild = () => {
  if (metadata.title.trim() === '') {
    metadata.title = 'example'
  }
  if (metadata.author.trim() === '') {
    metadata.author = 'unknown'
  }
  if (metadata.maker.trim() === '') {
    metadata.maker = 'elepub'
  }
  const cover = metadata.cover as ImageFile
  if (isEmptyObj(cover)) {
    if (metadata.images.length === 0) {
      return alertNotify('请添加图片', 'negative')
    }
    alertDilog(
      '提示',
      '没有选择封面，默认以第一张图作为封面，是否继续？',
      () => {
        metadata.cover = metadata.images[0]
        imageState.cover = imageState.images[0].url
        build()
        return
      }
    )
  }
  else {
    alertDilog('提示', '生成EPUB，是否继续？', build)
  }
}

// 控制显示侧边栏
const toggleRightDrawer = () => {
  rightDrawerOpen = !rightDrawerOpen
}
</script>