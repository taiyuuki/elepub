<template>
  <div class="loading z-top" v-if="isCreating">
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
      <span v-else style="font-size: 16px">保存中...</span>
    </q-circular-progress>
  </div>
  <input type="file" ref="input" hidden multiple accept="image/*" />
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="row q-gutter-md q-gutter-sm-sm items-center">
          <q-btn
            dense
            color="white"
            text-color="primary"
            :icon="biPlusSquareDotted"
            label="添加"
            @click="inputImage"
            ><q-tooltip class="bg-indigo" :offset="[10, 10]">
              添加图片
            </q-tooltip></q-btn
          >
          <q-btn
            dense
            color="red"
            text-color="white"
            :icon="biTrash"
            label="清空"
            @click="clearImages"
            ><q-tooltip class="bg-indigo" :offset="[10, 10]">
              清空图片
            </q-tooltip></q-btn
          >
          <q-btn
            dense
            color="secondary"
            text-color="white"
            :icon="biSave"
            label="保存"
            @click="createEPuB"
            ><q-tooltip class="bg-indigo" :offset="[10, 10]">
              保存epub
            </q-tooltip></q-btn
          >
        </q-toolbar-title>
        <q-btn
          dense
          color="white"
          text-color="primary"
          class="q-mx-md"
          :icon="biBookHalf"
          label="本地"
          @click="bookList"
        />

        <q-btn dense flat round :icon="biList" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
      overlay
      :width="280"
      persistent
      :breakpoint="600"
    >
      <MetaSet />
    </q-drawer>

    <q-page-container>
      <PreviewContent />
    </q-page-container>
    <q-dialog v-model="dialog.bar" persistent transition-show="flip-down">
      <q-card class="bg-primary text-white">
        <q-bar>
          <div>{{ dialog.barText }}</div>

          <q-space />

          <q-btn dense flat :icon="biXLg" v-close-popup @click="handleCancer" />
        </q-bar>

        <q-card-section>
          <div class="text-h6">{{ dialog.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ dialog.text }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="否"
            color="white"
            v-close-popup
            @click="handleCancer"
          />
          <q-btn
            flat
            label="是"
            color="white"
            v-close-popup
            @click="handleOk"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useMetadata } from '../stores/metadata';
import { useOptions } from '../stores/options';
import { useImages } from 'src/stores/images';
import { storeToRefs } from 'pinia';
import { useDialog } from '../stores/dialog';
import PreviewContent from '../pages/PreviewContent.vue';
import MetaSet from 'src/pages/MetaSet.vue';
import { msgTemplate, cssTemplate } from '../template/template';
import Epub from '../factory';
import {
  biCheckCircle,
  biPlusSquareDotted,
  biTrash,
  biSave,
  biList,
  biXLg,
  biBookHalf,
} from '@quasar/extras/bootstrap-icons';
export default defineComponent({
  components: { PreviewContent, MetaSet },
  setup() {
    const $q = useQuasar();
    const input = ref(null);
    let imageState = useImages();
    const rightDrawerOpen = ref(false);
    let {
      confoundingImage,
      confoundingXhtml,
      pageCount,
      firstChapter,
      chapterMode,
      firstPage,
    } = storeToRefs(useOptions());
    const progress = ref(0);
    const isCreating = ref(false);
    const check = ref(false);
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };
    const metadata = useMetadata();
    const dialog = useDialog();
    const router = useRouter();

    // 生成uuid
    const getUuid = (): string => {
      const url_uuid = URL.createObjectURL(new Blob());
      const uuid = url_uuid.toString(); //转字符串
      URL.revokeObjectURL(url_uuid); //释放
      return 'urn:uuid:' + uuid.substring(uuid.lastIndexOf('/') + 1);
    };
    metadata.id = getUuid();

    onMounted(() => {
      if (input.value !== null) {
        (<HTMLInputElement>input.value).onchange = (e: Event) => {
          let files = Array.from(
            (<HTMLInputElement>e.target).files as FileList
          );
          addImages(files);
          (<HTMLInputElement>e.target).value = '';
        };
      }
    });

    // 导入图片
    const inputImage = () => {
      if (input.value !== null) {
        (<HTMLInputElement>input.value).click();
      }
    };

    const addImages = (files: File[]) => {
      files.forEach((file: File) => {
        imageState.images.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
        metadata.$patch((state) => {
          state.images.push({
            name: file.name,
            path: file.path,
            data: file,
            originName: file.name,
          });
        });
      });
    };

    // 清空
    const clearImages = () => {
      if (imageState.images.length > 0) {
        imageState.images.forEach((item) => {
          URL.revokeObjectURL(item.url);
        });
      }
      imageState.images.length = 0;
      metadata.$patch((state) => {
        state.images = [];
      });
    };

    // 跳转本地漫画
    const bookList = () => {
      router.push({
        path: '/booklist',
      });
    };

    // 提示消息
    const showDialog = (title: string, str: string) => {
      dialog.$patch((state) => {
        state.barText = title;
        state.text = str;
        state.bar = true;
      });
    };

    // 随机文件名
    const getRondomName = () => {
      function getRandom(digit: number) {
        let result = '';
        for (let i = 1; i <= digit; i++) {
          result += Math.floor(Math.random() * 16).toString(16);
        }
        return result;
      }
      return getRandom(12);
    };

    // 设置每一页section
    const getHtmlSection = (epub: document) => {
      return new Promise((resolve) => {
        let count = firstChapter.value;
        let mode_1 =
          chapterMode.value === 'default' ||
          (chapterMode.value === 'mark' && firstPage.value.trim().length === 0);
        let mode_2 =
          chapterMode.value === 'mark' && firstPage.value.trim().length > 0;
        let mode_3 = chapterMode.value === 'count' && pageCount.value !== 1;
        let regM = new RegExp(firstPage.value);
        metadata.images.forEach((item: imagefile, i: number) => {
          let fileName = confoundingXhtml.value ? getRondomName() : `P${i + 1}`;
          let imageName = confoundingImage.value ? item.name : item.originName;
          if (mode_2) {
            if (regM.test(item.originName)) {
              epub.addSection(
                `第${count}话`,
                `<img alt='${imageName}' src='../images/${imageName}'/>`,
                false,
                false,
                fileName
              );
              count++;
            } else {
              epub.addSection(
                `P${i + 1}`,
                `<img alt='${imageName}' src='../images/${imageName}'/>`,
                true,
                false,
                fileName
              );
            }
          } else if (mode_3) {
            if (i % pageCount.value === 0) {
              let alt = `P${i + 1}-P${i + Number(pageCount.value)}`;
              if (i + Number(pageCount.value) >= metadata.images.length) {
                alt = `P${i + 1}-P${metadata.images.length}`;
              }
              epub.addSection(
                alt,
                `<img alt='${imageName}' src='../images/${imageName}'/>`,
                false,
                false,
                fileName
              );
            } else {
              epub.addSection(
                `P${i + 1}`,
                `<img alt='${imageName}' src='../images/${imageName}'/>`,
                true,
                false,
                fileName
              );
            }
          } else if (mode_1) {
            epub.addSection(
              `P${i + 1}`,
              `<img alt='${imageName}' src='../images/${imageName}'/>`,
              false,
              false,
              fileName
            );
          }
        });
        resolve(true);
      });
    };

    // 生成epub
    const createEPuB = () => {
      progress.value = 0;
      check.value =
        metadata.cover.hasOwnProperty('data') || metadata.images.length > 0;
      if (!check.value) {
        showDialog('提示', '请至少添加一张图片或封面');
      } else if (!metadata.cover.hasOwnProperty('data')) {
        showDialog(
          '提示',
          '没有添加封面，默认以第一张图片作为封面，是否继续？'
        );
      } else {
        showDialog('确认', '生成epub，是否继续？');
      }
    };

    // 导出epub
    const outputEpub = async (folder: string) => {
      check.value = false;
      if (confoundingImage.value) {
        metadata.images.forEach((item) => {
          item.name =
            getRondomName() + item.name.substring(item.name.lastIndexOf('.'));
        });
      } else {
        metadata.images.forEach((item) => {
          if (item.name !== item.originName) {
            item.name = item.originName;
          }
        });
      }
      const epub = Epub(metadata);
      epub.addCSS(cssTemplate);
      epub.addSection('说明', msgTemplate, false, false, 'msg');
      await getHtmlSection(epub);
      isCreating.value = true;
      await epub.writeEPUB(
        metadata.title + metadata.sequence,
        folder,
        progress
      );
      isCreating.value = false;
      $q.notify({
        type: 'positive',
        caption: '已完成',
        message: '文件保存于根目录EPUB文件夹下',
        position: 'top-right',
        icon: biCheckCircle,
      });
    };

    // 确认
    const handleOk = () => {
      if (check.value) {
        outputEpub('./EPUB');
      }
    };
    // 取消
    const handleCancer = () => {
      check.value = false;
    };
    return {
      input,
      inputImage,
      clearImages,
      progress,
      dialog,
      rightDrawerOpen,
      handleCancer,
      toggleRightDrawer,
      createEPuB,
      outputEpub,
      handleOk,
      bookList,
      isCreating,
      biCheckCircle,
      biPlusSquareDotted,
      biTrash,
      biSave,
      biList,
      biXLg,
      biBookHalf,
    };
  },
});
</script>

<style lang="scss">
.elepub-link {
  color: #fff;
  font-size: 20px;
  text-decoration-line: none;
  &:hover {
    text-shadow: 0 0 5px #fff;
  }
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  align-items: center;
}
</style>
