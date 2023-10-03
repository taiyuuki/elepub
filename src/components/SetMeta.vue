<script lang="ts">
export default { name: 'set-meta' }
</script>

<script lang="ts" setup>
import { useMeta, volume } from 'src/composables/use-meta'
import { useCover, triggerSetContents } from 'src/composables/use-images'
import { useOptions } from 'src/composables/use-options'
import { is_void, str_uuid } from '@taiyuuki/utils'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'
import { getFileName } from 'src/utils'
import { effect } from 'vue'

const tabs = ['basemeta', 'moremeta', 'options']
const tab = ref('basemeta')
const meta = useMeta()
const cover = useCover()
const {
    confoundingImage,
    confoundingXhtml,
    pageCount,
    firstChapter,
    chapterMode,
    firstPage,
    output,
} = useOptions()

effect(() => {
    firstPage.value
    if (pageCount.value < 2) {
        pageCount.value = 10
    }
    if (firstChapter.value < 0) {
        firstChapter.value = 0
    }
    triggerSetContents()
})

function resetId() {
    meta.id = `urn:uuid:${str_uuid()}`
}

async function selectCover() {
    const coverPath = await open({
        title: '请选择封面',
        filters: [{
            name: 'image',
            extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tif', 'tiff'],
        }],
    }) as string
    if (is_void(coverPath)) {
        return
    }
    cover.value.url = convertFileSrc(coverPath)
    cover.value.name = getFileName(coverPath)
    cover.value.path = coverPath
}

async function selectDirectory() {
    const outputPath = await open({ title: '选择保存路径', directory: true }) as string
    if (is_void(outputPath)) {
        return
    }
    output.value = outputPath
}

onMounted(resetId)
</script>

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
      <div
        display="block"
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
        @click="selectCover"
      >
        <img
          v-if="cover.url !== ''"
          class="middle-inner"
          w="100%"
          :src="cover.url"
          alt=""
        >
        <span v-else>选择封面</span>
      </div>
    </section>
    <q-input
      v-model.lazy="meta.title"
      outlined
      label="书名"
    />
    <q-input
      v-model.lazy="meta.author"
      outlined
      label="作者"
    />
    <q-input
      v-model.lazy="meta.creator"
      outlined
      label="制作者"
    />
    <q-input
      v-model="meta.id"
      outlined
      label="id"
    >
      <template #append>
        <div
          class="i-bi:arrow-clockwise"
          text="color-primary hover:color-var-secondary"
          pointer
          @click="resetId"
        >
          <q-tooltip
            :offset="[10, 10]"
            text="#fff"
            bg="var-secondary"
          >
            随机id
          </q-tooltip>
        </div>
      </template>
    </q-input>
    <q-input
      v-model.lazy="volume"
      outlined
      label="集/卷"
    />
    <q-input
      v-model.lazy="meta.publisher"
      outlined
      label="出版商"
    />
    <q-input
      v-model="meta.description"
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
          @update:model-value="triggerSetContents"
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
                bg="var-secondary"
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
    <div
      @click="selectDirectory"
    >
      <q-field
        filled
        label="保存路径"
        stack-label
        outlined
        class="m-5 pointer"
      >
        <template #control>
          <div
            class="self-center full-width no-outline"
            tabindex="0"
          >
            <span v-if="output !== ''">{{ output }}</span>
            <span v-else>选择保存路径</span>
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<style lang="scss">
.tab-active {
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 15%);
  background: linear-gradient(to bottom, #e0e0e0, #fff 6px);
}
</style>
