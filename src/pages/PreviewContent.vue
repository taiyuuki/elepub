<template>
  <div class="row q-gutter-md items-start no-wrap">
    <div
      class="q-pa-md col-8 col-grow"
      style="max-width: 720px; max-height: 80vh"
    >
      <q-bar class="bg-primary text-white"> 预览 </q-bar>
      <q-scroll-area
        :thumb-style="thumbStyle"
        style="max-width: 720px; height: 80vh; position: relative"
        class="bg-indigo-1"
        id="scroll-control"
      >
        <template v-if="imageState.images.length > 0">
          <div
            class="image-item"
            v-for="(item, i) in imageState.images"
            :key="item.name"
            :id="`n${i}`"
          >
            <img :src="item.url" alt="" />
            <p class="page-number">{{ i + 1 }}</p>
          </div>
        </template>
      </q-scroll-area>
    </div>

    <div class="q-pa-md col-4 gt-sm orientation-landscape">
      <q-layout
        style="width: 300px; min-height: 150px"
        class="shadow-2 rounded-borders"
      >
        <q-header style="position: relative">
          <q-toolbar>
            <q-toolbar-title> 图片列表 </q-toolbar-title>
            <q-btn
              :icon="biListTask"
              unelevated
              @click="switchShowMode"
              v-show="imageState.images.length > 0"
            />
          </q-toolbar>
        </q-header>

        <div style="max-height: 80vh; overflow-y: scroll; position: relative">
          <template v-if="imageState.images.length > 0">
            <template v-if="listMode">
              <q-list separator>
                <q-item
                  clickable
                  v-for="(image, i) in imageState.images"
                  @click="goAnchor(`#n${i}`)"
                  @mouseover="isHidden = i"
                  @mouseleave="isHidden = -1"
                  class="row drop-li"
                  :key="image.name"
                >
                  <q-item-section class="ellipsis no-select">{{
                    image.name
                  }}</q-item-section>
                  <div class="remove-item">
                    <q-btn
                      @click.stop="setCover(i)"
                      :icon="biImage"
                      size="sm"
                      color="transparent"
                      text-color="primary"
                      unelevated
                      round
                      ><q-tooltip class="bg-indigo" :offset="[10, 10]">
                        设为封面
                      </q-tooltip></q-btn
                    >
                    <q-btn
                      @click.stop="removeImage(i)"
                      :icon="biXLg"
                      size="sm"
                      color="transparent"
                      text-color="primary"
                      unelevated
                      round
                      ><q-tooltip class="bg-indigo" :offset="[10, 10]">
                        删除
                      </q-tooltip></q-btn
                    >
                  </div>
                </q-item>
              </q-list>
            </template>
            <template v-else>
              <q-card
                class="my-card q-my-sm"
                v-for="(item, i) in imageState.images"
                :key="item.name"
                @click="goAnchor(`#n${i}`)"
                style="cursor: pointer"
                @mouseover="isHidden = i"
                @mouseleave="isHidden = -1"
              >
                <div
                  :class="{
                    absolute: true,
                    'remove-item': true,
                    hidden: isHidden !== i,
                  }"
                >
                  <q-btn
                    @click.stop="setCover(i)"
                    :icon="biImage"
                    color="transparent"
                    text-color="white"
                    unelevated
                    round
                    ><q-tooltip class="bg-indigo" :offset="[10, 10]">
                      设为封面
                    </q-tooltip></q-btn
                  >
                  <q-btn
                    @click="removeImage(i)"
                    :icon="biXLg"
                    color="transparent"
                    text-color="white"
                    unelevated
                    round
                    ><q-tooltip class="bg-indigo" :offset="[10, 10]">
                      删除
                    </q-tooltip></q-btn
                  >
                </div>
                <q-img
                  :src="item.url"
                  loading="eager"
                  style="height: 240px; overflow: hidden"
                >
                  <div class="absolute-bottom text-subtitle2 text-center">
                    {{ item.name }}
                  </div>
                </q-img>
              </q-card>
            </template>
          </template>
          <q-page-scroller
            position="bottom-right"
            :scroll-offset="150"
            :offset="[18, 18]"
          >
          </q-page-scroller>
        </div>
      </q-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMetadata } from '../stores/metadata';
import { useImages } from 'src/stores/images';
import { biListTask, biImage, biXLg } from '@quasar/extras/bootstrap-icons';
export default defineComponent({
  name: 'preview-content',
  setup() {
    let year = new Date(Date.now()).getFullYear();
    const metadata = useMetadata();
    const isHidden = ref(-1);
    let listMode = ref(true);
    let drag = ref(false);
    let imageState = useImages();
    const thumbStyle = {
      right: '4px',
      borderRadius: '5px',
      backgroundColor: '#027be3',
      width: '5px',
      opacity: '0.75',
    };

    // 删除图片
    const removeImage = (i: number) => {
      metadata.$patch((state) => {
        state.images.splice(i, 1);
      });
      imageState.images.splice(i, 1);
    };

    // 设置封面
    const setCover = (i: number) => {
      metadata.cover.name = metadata.images[i].name;
      metadata.cover.data = metadata.images[i].data;
      metadata.cover.path = metadata.images[i].path;
    };

    // 切换显示模式
    const switchShowMode = () => {
      listMode.value = !listMode.value;
    };

    // 锚点跳转
    function goAnchor(selector: string) {
      const target = document.querySelector(selector);
      const outArea = target?.parentNode?.parentNode;
      let top = (<HTMLElement>target).offsetTop;
      (<HTMLElement>outArea).scrollTop = top;
    }
    return {
      biListTask,
      imageState,
      biImage,
      biXLg,
      metadata,
      year,
      thumbStyle,
      isHidden,
      removeImage,
      drag,
      switchShowMode,
      listMode,
      goAnchor,
      setCover,
    };
  },
});
</script>

<style lang="scss">
.image-item {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 0;
  img {
    width: 100%;
  }
  .page-number {
    text-align: center;
    font-size: 16px;
    text-indent: 0;
    width: 45px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 2px;
    position: absolute;
    bottom: 15px;
    left: 45%;
    bottom: 5px;
    line-height: 30px;
  }
}
.remove-item {
  box-sizing: border-box;
  z-index: 1;
  color: #fff;
  right: 5px;
  top: 5px;
  cursor: pointer;
  font-size: large;
}
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
