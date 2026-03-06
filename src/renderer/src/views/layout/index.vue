<template>
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <MusicDrawer />
  <div class="layout relative h-full">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1 min-w-0">
        <div class="header-wrapper px-[40px]">
          <BaseHeader />
        </div>
        <div class="content-box h-[calc(100%-80px)] overflow-auto overflow-y-auto px-[40px] pb-[80px]">
          <router-view v-slot="{ Component }" >
            <component v-if="!isLoaidng" :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>
  </div>
  <BaseButtom :class="[musicStore.musicUrl.length ? 'bottom-show' : 'bottom-visible']">
    <template #default>
      <MusicPlayer ref="audioInstance" :src="musicStore.musicUrl" :songs="musicStore.songs" />
    </template>
  </BaseButtom>

</template>

<script lang="ts" setup>
import { onMounted, ref, provide } from 'vue'
import { useMusicStore } from '@/store';
import { useContextMenu } from '@/composables/useContextMenu';
import BaseAside from './components/BaseAside.vue'
import BaseHeader from './components/BaseHeader.vue';
import BaseButtom from './components/BaseButtom.vue';
import MusicPlayer, { MusicPlayerInstanceType } from '@/components/MusicPlayer/index.vue'
import { useUserInfo } from '@/composables/useUserInfo';
import MusicDrawer from './components/MusicDrawer.vue'

// 音乐播放器实例
const audioInstance = ref<MusicPlayerInstanceType>()

const musicStore = useMusicStore()

// 全局上下文菜单
const { MENU_kEY, setActiveMenu, activeMenu } = useContextMenu()
provide(MENU_kEY, {
  setActiveMenu,
  activeMenu
})



onMounted(async () => {
  if (audioInstance.value !== undefined) {
    window.$audio = audioInstance.value!
    console.log('初始化全局$audio：', window.$audio)
  }
  await getUserInfo()
})

const { getUserInfoFn, isLoaidng } = useUserInfo()
const getUserInfo = async () => {
  await getUserInfoFn()


}



</script>

<style scoped lang="scss">
.layout {

  width: 100%;

  .box {
    height: calc(100%);
    width: 100%;
    display: flex;
  }
}

.bottom-show {
  visibility: visible;
  opacity: 1;
}

.bottom-visible {
  visibility: hidden;
  opacity: 0;
}
</style>
