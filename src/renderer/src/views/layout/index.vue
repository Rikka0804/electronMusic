<template>
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <MusicDrawer />
  <LoginBox ref="loginBoxRef" @closeLogin="handleLoginSuccess" />
  <div class="layout relative h-full">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1 min-w-0">
        <div class="header-wrapper shrink-0 px-[40px]">
          <BaseHeader />
        </div>
        <div ref="contentBoxRef" class="content-box app-scrollbar px-[40px]" :style="contentBoxStyle">
          <router-view v-slot="{ Component }" >
            <component v-if="!isLoaidng" :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>
  </div>
  <BaseButtom :class="[hasPlayer ? 'bottom-show' : 'bottom-visible']">
    <template #default>
      <MusicPlayer ref="audioInstance" :src="musicStore.musicUrl" :songs="musicStore.songs" />
    </template>
  </BaseButtom>

</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMusicStore, useUserStore } from '@/store';
import { useContextMenu } from '@/composables/useContextMenu';
import BaseAside from './components/BaseAside.vue'
import BaseHeader from './components/BaseHeader.vue';
import BaseButtom from './components/BaseButtom.vue';
import MusicPlayer, { MusicPlayerInstanceType } from '@/components/MusicPlayer/index.vue'
import { useUserInfo } from '@/composables/useUserInfo';
import MusicDrawer from './components/MusicDrawer.vue'
import LoginBox from './components/LoginBox.vue'

const contentBoxRef = ref<HTMLDivElement>()
const route = useRoute()

// 音乐播放器实例
const audioInstance = ref<MusicPlayerInstanceType>()

const musicStore = useMusicStore()
const userStore = useUserStore()
const hasPlayer = computed(() => !!musicStore.musicUrl.length)
const contentBoxStyle = computed(() => ({
  paddingBottom: hasPlayer.value ? '96px' : '16px'
}))

// 全局上下文菜单
const { MENU_kEY, setActiveMenu, activeMenu } = useContextMenu()
provide(MENU_kEY, {
  setActiveMenu,
  activeMenu
})

// 登录框引用
const loginBoxRef = ref<InstanceType<typeof LoginBox>>()

onMounted(async () => {
  if (audioInstance.value !== undefined) {
    window.$audio = audioInstance.value!
    console.log('初始化全局$audio：', window.$audio)
  }

  // 检查是否有 cookie，没有则打开登录框
  if (!userStore.cookie) {
    console.log('未检测到 cookie，打开登录框')
    loginBoxRef.value?.handleOpen()
  } else {
    // 有 cookie 则获取用户信息
    await getUserInfo()
  }
})

const { getUserInfoFn, isLoaidng } = useUserInfo()
const getUserInfo = async () => {
  await getUserInfoFn()
}

// 登录成功后的回调
const handleLoginSuccess = async () => {
  console.log('登录成功，开始获取用户信息')
  await getUserInfo()
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    contentBoxRef.value?.scrollTo({
      top: 0
    })
  }
)



</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  overflow: hidden;

  .box {
    height: 100%;
    width: 100%;
    display: flex;
  }

  .content {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .content-box {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
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
