<template>
  <q-tabs v-model="tab" inline-label class="bg-primary text-white shadow-2">
    <q-tab name="basemeta" label="元数据" />
    <q-tab name="moremeta" label="分章" />
    <q-tab name="options" label="选项" />
  </q-tabs>
  <div v-show="tab === tabs[0]">
    <input type="file" ref="coverBtn" style="display: none" accept="image/*" />
    <section class="base-meta">
      <div class="set-cover bg-indigo-1" @click="inputCover">
        <img v-if="imageUrl" :src="imageUrl" alt="" />
        <span v-else>选择封面</span>
      </div>
    </section>
    <q-input outlined v-model.lazy="metadata.title" label="书名" />
    <q-input outlined v-model.lazy="metadata.author" label="作者" />
    <q-input outlined v-model.lazy="metadata.maker" label="制作者" />
    <q-input outlined v-model="metadata.id" label="id">
      <template v-slot:append>
        <q-avatar>
          <q-btn
            :icon="biArrowClockwise"
            text-color="primary"
            @click="metadata.id = getUuid()"
          />
        </q-avatar>
      </template>
    </q-input>
    <q-input outlined v-model.lazy="metadata.sequence" label="集/卷" />
    <q-input outlined v-model.lazy="metadata.publisher" label="出版商" />
    <q-input outlined v-model.lazy="metadata.published" label="出版日期" />
    <q-input outlined v-model.lazy="metadata.genre" label="流派" />
    <q-input outlined v-model.lazy="metadata.tags" label="标签" />
    <q-input
      v-model="metadata.description"
      outlined
      type="textarea"
      label="内容简介"
    />
  </div>
  <div v-show="tab === tabs[1]">
    <div class="q-ma-sm">
      <div class="q-my-gutter-md" style="max-width: 350px">
        <q-option-group
          v-model="chapterMode"
          inline
          :options="[
            { label: '默认', value: 'default' },
            { label: '按标记', value: 'mark' },
            { label: '按页数', value: 'count' },
          ]"
        />
        <q-tab-panels v-model="chapterMode" animated class="q-my-xs">
          <q-tab-panel name="default">
            <div class="q-my-sm text-caption">每一张图片就是一章</div>
          </q-tab-panel>

          <q-tab-panel name="mark">
            <div class="q-my-sm text-caption">
              请给每话第一张图片的文件名添加标记（支持正则），例如“_C”：xxx_C.jpg，epub会自动匹配标记进行分章。
            </div>
            <q-input outlined v-model.lazy="firstPage" label="输入设置的标记" />
            <q-input
              outlined
              v-model.lazy="firstChapter"
              type="number"
              :rules="[(val) => val >= 0]"
              label="开始章节"
            >
              <q-tooltip class="bg-indigo" :offset="[10, 10]">
                这本书开始于第几话
              </q-tooltip></q-input
            >
          </q-tab-panel>

          <q-tab-panel name="count">
            <div class="q-my-xs text-caption">按固定页数分章</div>
            <q-input
              outlined
              v-model.lazy="pageCount"
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
    <q-checkbox class="q-ma-sm" v-model="confoundingImage" label="混淆图片名" />
    <q-checkbox
      class="q-ma-sm"
      v-model="confoundingXhtml"
      label="混淆xhtml名"
    />
    <div class="q-pa-md">勾选可以打乱文件名称。</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useMetadata } from '../stores/metadata';
import { useOptions } from '../stores/options';
import { storeToRefs } from 'pinia';
import { getUuid } from '../factory/utility';
import { biArrowClockwise } from '@quasar/extras/bootstrap-icons';
export default defineComponent({
  setup() {
    const tabs = ['basemeta', 'moremeta', 'options'];
    let tab = ref('basemeta');
    const metadata = useMetadata();
    let {
      confoundingImage,
      confoundingXhtml,
      pageCount,
      firstChapter,
      chapterMode,
      firstPage,
    } = storeToRefs(useOptions());
    let coverBtn = ref(null);
    let imageUrl = ref<string>('');

    watch(pageCount, () => {
      if (pageCount.value < 2) {
        pageCount.value = 2;
      }
    });
    watch(firstChapter, () => {
      if (firstChapter.value < 0) {
        firstChapter.value = 0;
      }
    });
    watch(
      () => metadata.cover.data,
      () => {
        imageUrl.value = URL.createObjectURL(metadata.cover.data);
      }
    );

    // 导入封面
    const inputCover = () => {
      if (coverBtn.value !== null) {
        (<HTMLInputElement>coverBtn.value).click();
      }
    };
    onMounted(() => {
      // 导入封面事件
      if (coverBtn.value !== null) {
        (<HTMLInputElement>coverBtn.value).onchange = (e: Event) => {
          let cf = (<FileList>(<HTMLInputElement>e.target).files)[0];
          metadata.cover.name = cf.name;
          metadata.cover.path = cf.path;
          metadata.cover.data = cf;
          imageUrl.value = URL.createObjectURL(cf);
        };
      }
    });

    return {
      tab,
      tabs,
      metadata,
      coverBtn,
      inputCover,
      imageUrl,
      getUuid,
      confoundingImage,
      confoundingXhtml,
      chapterMode,
      firstChapter,
      pageCount,
      firstPage,
      biArrowClockwise,
    };
  },
});
</script>

<style lang="scss">
.set-cover {
  margin: 5px auto;
  width: 200px;
  height: 320px;
  overflow: hidden;
  border: 1px dashed $primary;
  color: $primary;
  border-radius: 5px;
  line-height: 300px;
  text-align: center;
  cursor: pointer;
  font-size: x-large;
  img {
    width: 100%;
  }
}
</style>
