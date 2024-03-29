<script lang="ts">
export default { name: 'preview-content' }
</script>

<script lang="ts" setup>
import { importing } from 'src/composables/use-loading'
import { useImages, useCover, useContents, removeContentsItem, clearContents, setContents, triggerSetContents } from 'src/composables/use-images'
import { is_empty_string, is_not_empty_string } from '@taiyuuki/utils'
import { ensureNoExt } from 'src/utils'

const images = useImages()
const cover = useCover()
const contents = useContents()

const hasContents = computed(() => {
    return !is_empty_string(contents)
})
const thumbStyle = {
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#027be3',
    width: '5px',
    opacity: '0.75',
}

const imagesCount = computed(() => {
    return images.length
})

// 添加至目录
const addToContents = (i: number, name: string) => {
    contents[i] = ensureNoExt(name)
}

// 删除图片
const removeImage = (i: number) => {
    images.splice(i, 1)
    triggerSetContents()
}

// 设置封面
const setCover = (i: number) => {
    cover.value = JSON.parse(JSON.stringify(toRaw(images[i])))
}

// 锚点跳转
function goAnchor(selector: string) {
    const target = document.querySelector(selector) as HTMLElement
    if (target) {
        const outArea = target.parentNode?.parentNode as HTMLElement
        if (outArea) {
            const top = target.offsetTop
            outArea.scrollTop = top
        }
    }
}

// 编辑目录
function editTitle(e: Event, i: string | number) {
    const target = e.target as HTMLElement
    // 不允许换行
    if ((<InputEvent>e).inputType === 'insertParagraph') {
        target.innerText = contents[i]
        return
    }
    if (target.innerText.length <= 30) {
        contents[i] = target.innerText
    }
    else {
        return
    }
}

// 如果目录标题为空
function initTitle(e: Event, i: string | number) {
    const target = e.target as HTMLElement
    if (target.innerText.trim() === '') {
        contents[i] = `P${Number(i) + 1}`
    }
}

// 导入目录
function importContents(e: Event) {
    const inputEl = e.target as HTMLInputElement
    const files = inputEl.files as FileList
    if (files[0]) {
        const reader = new FileReader()
        reader.readAsText(files[0])
        reader.addEventListener('load', (re) => {
            const target = re.target as FileReader
            if (target) {
                const text = target.result as string
                const inputContents = text.split('\n').filter(item => is_not_empty_string(item, true))
                const len = Object.keys(contents).length
                let index = 0
                for (const i in contents) {
                    if (index < len && index < inputContents.length) {
                        contents[i] = inputContents[index++]
                    }
                    else {
                        break
                    }
                }
            }
            inputEl.value = ''
        })
    }
}
</script>

<template>
  <div
    flex="row items-start"
    text="nowrap"
    h="95vh"
    p="t-50"
  >
    <div
      p="8"
      w="lg:min-512 lg:max-50% lg:50% 100% max-512"
      h="100%"
    >
      <q-bar class="bg-primary text-white">
        预览
      </q-bar>
      <q-scroll-area
        id="scroll-control"
        :thumb-style="thumbStyle"
        w="100%"
        h="100%"
        pst="rel"
        class="bg-indigo-1"
      >
        <template v-if="imagesCount > 0">
          <div
            v-for="(item, i) in images"
            :id="`n${i}`"
            :key="item.name"
            pst="rel"
            m="0"
            p="0"
            text="0"
          >
            <img
              w="100%"
              :src="item.url"
              alt=""
            >
            <p
              text="center 16 indent-0 #fff"
              line="30"
              border="radius-2"
              pst="abs b-15 l-45%"
              w="45"
              h="30"
              bg="#00000099"
            >
              {{ i + 1 }}
            </p>
          </div>
        </template>
        <q-inner-loading :showing="importing">
          <q-spinner-hourglass
            size="50px"
            color="primary"
          />
        </q-inner-loading>
      </q-scroll-area>
    </div>

    <div
      p="y-8"
      display="none lg:block"
      style="width: calc(50% - 285px)"
    >
      <div class="rounded-borders">
        <div
          pst="rel"
          bg="primary"
          text="#fff"
        >
          <q-bar class="bg-primary text-white">
            图片列表
            <span
              v-if="imagesCount > 0"
              :title="`共${imagesCount}张图片`"
            >({{ imagesCount }})</span>
          </q-bar>
        </div>

        <div
          overflow-y-auto
          pst="rel"
          h="45vh"
          shadow-1
        >
          <template v-if="imagesCount > 0">
            <q-list separator>
              <q-item
                v-for="(image, i) in images"
                :key="image.name"
                clickable
                class="row drop-li"
                hover="[&>.item]:display-block"
                @click="goAnchor(`#n${i}`)"
              >
                <q-item-section class="ellipsis no-select">
                  {{ image.name }}
                </q-item-section>
                <div
                  border="box"
                  z-index="1"
                  pointer
                  text="primary 20"
                  pst="abs r-5 t-5"
                  display="none"
                  class="item"
                >
                  <q-btn
                    size="sm"
                    m="r-5"
                    dense
                    unelevated
                    @click.stop="addToContents(i, image.name)"
                  >
                    <div
                      class="i-ic:baseline-content-paste-go"
                      w="20"
                      h="20"
                      text="var-primary"
                    />
                    <q-tooltip
                      :offset="[10, 10]"
                      text="#fff"
                      bg="var-secondary"
                    >
                      添加至目录
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    size="sm"
                    m="r-5"
                    dense
                    unelevated
                    @click.stop="setCover(i)"
                  >
                    <div
                      class="i-bi:image"
                      w="20"
                      h="20"
                      text="var-primary"
                    />
                    <q-tooltip
                      :offset="[10, 10]"
                      text="#fff"
                      bg="var-secondary"
                    >
                      设为封面
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    size="sm"
                    dense
                    unelevated
                    @click.stop="removeImage(i)"
                  >
                    <div
                      class="i-bi:x-lg"
                      w="20"
                      h="20"
                      text="var-primary"
                    />
                    <q-tooltip
                      :offset="[10, 10]"
                      text="#fff"
                      bg="var-secondary"
                    >
                      删除
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item>
              <q-separator />
            </q-list>
          </template>
        </div>

        <div
          pst="rel t-10"
          bg="primary"
          text="#fff"
        >
          <q-bar class="bg-primary text-white">
            <q-toolbar-title text="16">
              目录
            </q-toolbar-title>
            <div
              v-show="imagesCount > 0"
              flex="row items-center"
            >
              <q-btn
                unelevated
                dense
                m="r-5"
                @click="clearContents"
              >
                <div
                  class="i-ic:baseline-playlist-remove"
                  w="20"
                  h="20"
                />
                <q-tooltip
                  :offset="[10, 10]"
                  text="#fff"
                  bg="var-secondary"
                >
                  清空目录
                </q-tooltip>
              </q-btn>
              <q-btn
                unelevated
                dense
                m="r-5"
                @click="setContents"
              >
                <div
                  class="i-bi:arrow-repeat"
                  w="20"
                  h="20"
                />
                <q-tooltip
                  :offset="[10, 10]"
                  text="#fff"
                  bg="var-secondary"
                >
                  重置目录标题
                </q-tooltip>
              </q-btn>
              <q-btn
                unelevated
                dense
              >
                <label
                  for="input-contents"
                  pointer
                >
                  <div
                    class="i-bi:plus-lg"
                    w="20"
                    h="20"
                  />
                  <input
                    id="input-contents"
                    type="file"
                    accept="text/plain"
                    display="none"
                    @change="importContents"
                  >
                  <q-tooltip
                    :offset="[10, 10]"
                    text="#fff"
                    bg="var-secondary"
                  >
                    导入目录标题
                  </q-tooltip>
                </label>
              </q-btn>
            </div>
          </q-bar>
        </div>
        <div
          overflow-y-auto
          pst="rel"
          m="t-10"
          style="height: calc(50vh - 108px)"
          shadow-1
        >
          <template v-if="hasContents">
            <q-list separator>
              <q-item
                v-for="(item, i) in contents"
                :key="i"
                clickable
                class="row drop-li"
                hover="[&>.item]:display-block"
                @click="goAnchor(`#n${i}`)"
              >
                <q-item-section class="ellipsis no-select">
                  <div
                    text="break-all"
                    outline="0"
                    overflow="auto"
                    p="5"
                    contenteditable
                    @blur="initTitle($event, i)"
                    @input="editTitle($event, i)"
                  >
                    {{
                      item
                    }}
                  </div>
                </q-item-section>
                <div
                  border="box"
                  z-index="1"
                  pointer
                  text="primary 20"
                  pst="abs r-5 t-5"
                  display="none"
                  class="item"
                >
                  <q-btn
                    size="sm"
                    dense
                    unelevated
                    @click.stop="removeContentsItem(i)"
                  >
                    <div
                      class="i-bi:x-lg"
                      w="20"
                      h="20"
                      text="var-primary"
                    />
                    <q-tooltip
                      :offset="[10, 10]"
                      text="#fff"
                      bg="var-secondary"
                    >
                      删除
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item>
              <q-separator />
            </q-list>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.no-select {
  &::selection {
    background-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
}
.drop-li {
  transition: transform 0.3s;
}

a {
  text-decoration-line: none;
  color: inherit;
}
</style>
