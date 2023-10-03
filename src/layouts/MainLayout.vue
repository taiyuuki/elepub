<script setup lang="ts">
import { showDrawer } from 'src/composables/use-drawer'
import { generating, progress } from 'src/composables/use-loading'
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <MainHeader />
    <ImagePreview />
    <q-drawer
      v-model="showDrawer"
      show-if-above
      side="right"
      bordered
      overlay
      :width="280"
      persistent
      :breakpoint="792"
      overflow-hidden
    >
      <SetMeta />
    </q-drawer>
    <div
      v-if="generating"
      pst="fix"
      inset="0"
      bg="#00000088"
      z-index="3001"
      flex="row items-center"
    >
      <div class="m-auto">
        <q-spinner-gears
          text="white"
          size="10rem"
        />
        <div
          text="16 color-#fff bold center"
          m="t-10"
          animate-head-shake
          animate-count-infinite
        >
          已完成 {{ progress }}
        </div>
      </div>
    </div>
  </q-layout>
</template>
