<template>
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div class="layout relative h-full">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1 ">
        <div class="header-wrapper px-[40px]">
          <BaseHeader />
        </div>
        <div class="content-box h-[calc(100%-80px)] overflow-auto overflow-y-auto px-[40px] pb-[80px]">
          <router-view v-slot="{ Component }">
            <component :key="refresh" :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>
  </div>
  <BaseButtom :class="[playerShow ? 'bottom-show' : 'bottom-visible']">
    <template #default>
      <MusicPlayer
        :src="musicStore.musicUrl"
        :songs="musicStore.songs"
      />
    </template>
  </BaseButtom>

</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore , useMusicStore} from '@/store';
import { getUserInfoApi, getUserDetailApi } from '@/api/user'
import BaseAside from './components/BaseAside.vue'
import BaseHeader from './components/BaseHeader.vue';
import BaseButtom from './components/BaseButtom.vue';
import MusicPlayer from '@/components/MusicPlayer/index.vue';

const musicStore = useMusicStore()
const refresh = ref(0) // 登录完成后强制刷新组件
onMounted(async () => {
  await getUserInfo()
})
const getUserInfo = async () => {
  const res = await getUserInfoApi()
  const { level, createDays } = await getUserDetailApi(res.account.id)
  res.profile.level = level
  res.profile.createDays = createDays
  refresh.value++
  useUserStore().setUser(res)
}
const playerShow = ref(true)


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
