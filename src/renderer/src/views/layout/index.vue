<template>
  <div class="layout">
    <div class="box">
      <BaseAside></BaseAside>
      <div class="content flex-1">
        <BaseHeader></BaseHeader>
        <router-view></router-view>
      </div>
    </div>


  </div>


</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store';
import { getUserInfoApi } from '@/api/user'
import BaseAside from './components/BaseAside.vue'
import BaseHeader from './components/BaseHeader.vue';


onMounted(async () => {
  await getUserInfo()
})
const getUserInfo = async () => {
  const res = await getUserInfoApi()
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
