<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            dense
            label="返回"
            color="white"
            text-color="primary"
            :icon="biArrowLeftCircle"
            @click="router.back()"
          />
        </q-toolbar-title>

        <q-btn flat round :icon="biList" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
      :breakpoint="600"
      :width="150"
    >
      <template v-if="chapters.length > 0">
        <q-list padding class="rounded-borders">
          <q-item
            :clickable="!disable"
            :disable="disable"
            v-ripple
            v-for="(item, i) in chapters"
            :key="item.title"
            @click="getSections(item, i)"
            :active="active === i"
          >
            <q-item-section avatar>
              {{ item[0].title }}
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-drawer>

    <q-page-container>
      <template v-if="contents.length > 0">
        <div class="view-content" v-html="contents"></div>
      </template>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  biArrowLeftCircle,
  biList,
  biExclamationCircle,
} from '@quasar/extras/bootstrap-icons';
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const rightDrawerOpen = ref(false);
    const chapters = reactive([] as { id: string; title?: string }[][]);
    const contents = ref('');
    const disable = ref(false);
    const active = ref(0);
    const $q = useQuasar();
    onMounted(() => {
      const path = route.params.path;
      contents.value = `<img src="${route.params.data}" />`;

      window.preload.getBookChapters(path as string).then(
        (value) => {
          value.forEach((chpater) => {
            chapters.push(chpater);
          });
        },
        () => {
          $q.notify({
            type: 'warning',
            caption: '打开错误',
            message: '文件已不存在',
            position: 'top-right',
            icon: biExclamationCircle,
          });
        }
      );
    });
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const getSections = async (
      item: { id: string; title?: string }[],
      i: number
    ) => {
      active.value = i;
      disable.value = true;
      contents.value = '';
      contents.value += await window.preload.getCss();
      const ids = [] as string[];
      item.forEach((obj) => {
        ids.push(obj.id);
      });
      for await (const id of ids) {
        await window.preload.getSection(id).then(
          (section) => {
            contents.value += section;
          },
          () => {
            $q.notify({
              type: 'warning',
              caption: '未知错误',
              message: '不支持的文件',
              position: 'top-right',
              icon: biExclamationCircle,
            });
          }
        );
      }
      disable.value = false;
    };

    return {
      active,
      rightDrawerOpen,
      toggleRightDrawer,
      getSections,
      disable,
      router,
      chapters,
      contents,
      biArrowLeftCircle,
      biList,
    };
  },
};
</script>

<style lang="scss">
.view-content {
  max-width: 720px;
  margin: 0 auto;
  img {
    width: 100%;
    display: block;
  }
}
</style>
