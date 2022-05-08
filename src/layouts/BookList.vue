<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="row q-gutter-md items-center">
          <input
            type="file"
            name="open-manga"
            ref="inputManga"
            style="display: none"
            multiple
            accept=".epub"
          />
          <q-btn
            dense
            label="返回"
            color="white"
            text-color="primary"
            :icon="biArrowLeftCircle"
            @click="router.back()"
          />
          <q-btn
            dense
            label="打开"
            color="positive"
            text-color="white"
            :icon="biFileEarmarkPlus"
            @click="openBooksBtn"
            ><q-tooltip class="bg-indigo" :offset="[10, 10]">
              仅限elepub生成的EPUB
            </q-tooltip></q-btn
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="row q-gutter-sm q-ma-xs">
      <template v-if="books.length > 0">
        <q-card
          class="my-card column justify-between"
          v-for="(item, i) in books"
          :key="item.path"
          style="width: 150px; cursor: pointer"
          @click="readBook(item.path, item.data)"
        >
          <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="readBook(item.path, item.data)"
              >
                <q-item-section>阅读</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="removeBook(i)">
                <q-item-section>移除</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="openFolder(item.path)">
                <q-item-section>路径</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-card-section horizontal>
            <img style="width: 100%" :src="item.data" />
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle2 text-weight-bold">{{ item.title }}</div>
            <div class="text-caption">{{ item.author }}</div>
          </q-card-section>
          <q-btn
            @click.stop="removeBook(i)"
            :icon="biXLg"
            color="transparent"
            text-color="white"
            class="absolute remove-icon"
            unelevated
            round
            ><q-tooltip class="bg-indigo" :offset="[10, 10]">
              移除
            </q-tooltip></q-btn
          >
        </q-card>
      </template>
      <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {
  biArrowLeftCircle,
  biFileEarmarkPlus,
  biXLg,
  biExclamationCircle,
} from '@quasar/extras/bootstrap-icons';
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import { onMounted } from '@vue/runtime-core';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const router = useRouter();
    const inputManga = ref(null);
    const books = reactive([] as book[]);
    const isLoading = ref(true);
    const $q = useQuasar();
    onMounted(() => {
      window.preload.loadData().then(
        (data) => {
          books.length = 0;
          JSON.parse(data).forEach((item: book) => {
            books.push(item);
          });
        },
        () => {
          return;
        }
      );

      isLoading.value = false;
      if (inputManga.value !== null) {
        (<HTMLInputElement>inputManga.value).onchange = async (e: Event) => {
          isLoading.value = true;
          const files = Array.from(
            (<HTMLInputElement>e.target).files as FileList
          );
          for await (let file of files) {
            await window.preload.getBookMessage(file.path).then(
              (book) => {
                books.unshift(book);
              },
              () => {
                $q.notify({
                  type: 'warning',
                  caption: '打开错误',
                  message: '不支持该文件',
                  position: 'top-right',
                  icon: biExclamationCircle,
                });
              }
            );
          }
          window.preload.saveData(JSON.stringify(books));
          (<HTMLInputElement>e.target).value = '';
          isLoading.value = false;
        };
      }
    });

    // 添加书籍
    const openBooksBtn = () => {
      if (inputManga.value !== null)
        (<HTMLInputElement>inputManga.value).click();
    };

    // 打开书籍
    const readBook = (path: string, data: string) => {
      router.push({
        name: 'bookreader',
        params: { path, data },
      });
    };

    // 移除书籍
    const removeBook = (i: number) => {
      books.splice(i, 1);
      window.preload.saveData(JSON.stringify(books));
    };

    // 打开文件夹
    const openFolder = (folder: string) => {
      window.preload.openFolder(folder);
    };
    return {
      biArrowLeftCircle,
      biFileEarmarkPlus,
      biXLg,
      isLoading,
      inputManga,
      router,
      openBooksBtn,
      removeBook,
      openFolder,
      books,
      readBook,
    };
  },
};
</script>

<style lang="scss">
.remove-icon {
  top: 0px;
  right: 0px;
}
</style>
