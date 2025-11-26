<template>
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div class="layout relative" :style="{ height: bodyHeight }">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1 ">
        <div class="header-wrapper px-[40px]">
          <BaseHeader />
        </div>
        <div class="content-box h-[calc(100vh-155px)] overflow-auto overflow-y-aut px-[40px]" :style="{ height: contentHeight }">
          <router-view v-slot="{ Component }">
            <component :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>


  </div>
<div class="footer h-[80px] " v-if="helo">
  111111
</div>

</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/store';
import { getUserInfoApi, getUserDetailApi } from '@/api/user'
import BaseAside from './components/BaseAside.vue'
import BaseHeader from './components/BaseHeader.vue';

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
const helo = ref(false)
const contentHeight = computed(() => {
  return `calc(100vh - 75px - ${helo.value ? 80 : 0}px)`
})
const bodyHeight = computed(() => {
  return `calc(100% - ${helo.value ? 80 : 0}px)`
})

</script>

<style scoped lang="scss">
.layout {

  width: 100%;

  .box {
    height: 100%;
    width: 100%;
    display: flex;
  }
}
</style>
