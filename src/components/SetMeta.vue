<template>
  <q-tabs
    v-model="tab"
    inline-label
    class="bg-primary text-#fff"
    active-class="bg-#fff text-primary tab-active"
  >
    <q-tab
      name="basemeta"
      label="元数据"
    />
    <q-tab
      name="moremeta"
      label="目录设置"
    />
    <q-tab
      name="options"
      label="选项"
    />
  </q-tabs>
  <div
    v-show="tab === tabs[0]"
    overflow-y-auto
    style="height: calc(100vh - 100px)"
  >
    <section class="base-meta">
      <label
        display="block"
        for="input-cover"
        m="x-auto y-5"
        w="200"
        h="320"
        overflow-hidden
        shadow="1"
        border="radius-5"
        line="300"
        text="center 20 primary"
        class="middle-out before:middle-before"
        pointer
      >
        <input
          id="input-cover"
          ref="coverBtn"
          type="file"
          display="none"
          accept="image/jpg,image/png,image/jpeg"
        >
        <img
          v-if="imageState.cover !== ''"
          class="middle-inner"
          w="100%"
          :src="imageState.cover"
          alt=""
        >
        <span v-else>选择封面</span>
      </label>
    </section>
    <q-input
      v-model.lazy="metadata.title"
      outlined
      label="书名"
    />
    <q-input
      v-model.lazy="metadata.author"
      outlined
      label="作者"
    />
    <q-input
      v-model.lazy="metadata.maker"
      outlined
      label="制作者"
    />
    <q-input
      v-model="metadata.id"
      outlined
      label="id"
    >
      <template #append>
        <div
          class="i-bi:arrow-clockwise"
          text="color-primary hover:color-secondary"
          pointer
          @click="metadata.resetId"
        >
          <q-tooltip
            :offset="[10, 10]"
            text="#fff"
            bg="secondary"
          >
            随机id
          </q-tooltip>
        </div>
      </template>
    </q-input>
    <q-input
      v-model.lazy="metadata.sequence"
      outlined
      label="集/卷"
    />
    <q-input
      v-model.lazy="metadata.publisher"
      outlined
      label="出版商"
    />
    <q-input
      v-model.lazy="metadata.published"
      outlined
      label="出版日期"
    />
    <q-input
      v-model.lazy="metadata.genre"
      outlined
      label="流派"
    />
    <q-input
      v-model.lazy="metadata.tags"
      outlined
      label="标签"
    />
    <q-input
      v-model="metadata.description"
      outlined
      type="textarea"
      label="内容简介"
    />
  </div>
  <div v-show="tab === tabs[1]">
    <div class="q-ma-sm">
      <div
        class="q-my-gutter-md"
        style="max-width: 350px"
      >
        <q-option-group
          v-model="chapterMode"
          inline
          :options="[
            { label: '默认', value: 'default' },
            { label: '按标记', value: 'mark' },
            { label: '按页数', value: 'count' },
          ]"
          @update:model-value="emits('changeMode')"
        />
        <q-tab-panels
          v-model="chapterMode"
          animated
          class="q-my-xs"
        >
          <q-tab-panel name="default">
            <div class="q-my-sm text-caption">
              每张图片都会被列入目录
            </div>
          </q-tab-panel>

          <q-tab-panel
            name="mark"
            class="q-gutter-sm"
          >
            <div class="q-my-sm text-caption">
              设置标记，例如“01.jpg”，则名称为'xxx-01.jpg'的图片都会被列入目录，支持正则表达式，区分大小写。
            </div>
            <q-input
              v-model.lazy="firstPage"
              outlined
              label="输入标记"
            />
            <q-input
              v-model.lazy="firstChapter"
              outlined
              type="number"
              :rules="[(val) => val >= 0]"
              label="开始章节"
            >
              <q-tooltip
                text="#fff"
                bg="secondary"
                :offset="[10, 10]"
              >
                本集开始于第几话
              </q-tooltip>
            </q-input>
          </q-tab-panel>

          <q-tab-panel name="count">
            <div class="q-my-xs text-caption">
              以固定页数设置目录
            </div>
            <q-input
              v-model.lazy="pageCount"
              outlined
              :rules="[(val) => val >= 2]"
              type="number"
              label="页数"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
  <div v-show="tab === tabs[2]">
    <q-checkbox
      v-model="confoundingImage"
      class="q-ma-sm"
      label="混淆图片名"
    />
    <q-checkbox
      v-model="confoundingXhtml"
      class="q-ma-sm"
      label="混淆xhtml名"
    />
    <div class="q-pa-md">
      勾选可以打乱文件名称。
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'set-meta' }
</script>

<script lang="ts" setup>
import { useMetadata } from 'src/stores/metadata'
import { useOptions } from 'src/stores/options'
import { useImages } from 'src/stores/images'
import { isElectron } from 'src/factory/utils'

const emits = defineEmits(['changeMode'])

const tabs = ['basemeta', 'moremeta', 'options']
const tab = $ref('basemeta')
const metadata = useMetadata()
const imageState = useImages()
const {
  confoundingImage,
  confoundingXhtml,
  pageCount,
  firstChapter,
  chapterMode,
  firstPage,
} = storeToRefs(useOptions())
const coverBtn = $ref(null)

watchEffect(() => {
  firstPage.value
  if (pageCount.value < 2) {
    pageCount.value = 10
  }
  if (firstChapter.value < 0) {
    firstChapter.value = 0
  }
  if (imageState.images.length > 0) {
    emits('changeMode')
  }
})

onMounted(() => {
  metadata.resetId()
  // 导入封面事件
  if (coverBtn !== null) {
    const oBtn = coverBtn as HTMLInputElement
    oBtn.addEventListener('change', () => {
      const files = oBtn.files as FileList
      const coverFile = files[0]
      imageState.cover = URL.createObjectURL(coverFile)
      oBtn.value = ''
      if (isElectron()) {
        metadata.cover = coverFile.path
      }
      else {
        metadata.cover = {
          name: coverFile.name,
          data: coverFile,
        }
      }
    })
  }
})
</script>

<style lang="scss">
.tab-active {
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 15%);
  background: linear-gradient(to bottom, #e0e0e0, #fff 6px);
}
</style>