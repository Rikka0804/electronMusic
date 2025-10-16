<template>
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div class="layout relative">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1 px-[40px]">
        <BaseHeader></BaseHeader>
        <div class="content-box h-[100vh-75px] overflow-auto overflow-y-auto">
          <router-view v-slot="{ Component }">
            <component :key="refresh" :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>


  </div>


</template>

<script lang="ts" setup>
import { onMounted,ref } from 'vue'
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

</script>

<style scoped lang="scss">
.layout {
  height: 100%;
  width: 100%;

  .box {
    height: 100%;
    width: 100%;
    display: flex;
  }
}
</style>
