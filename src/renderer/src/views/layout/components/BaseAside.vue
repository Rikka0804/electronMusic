<template>
  <div class="aside h-full w-[195px] box-border">
    <div class="avator-box flex ">
      <div class="h-[70px] w-full flex items-center cursor-pointer justify-center" @click="handleLogin"
        v-if="!userStore.isLogin">
        <el-avatar :size="30" />
        <span class="ml-2 text-[14px]">未登录</span>
      </div>
      <div class="h-[70px] w-full flex items-center cursor-pointer justify-center" v-else @click="handleUser">
        <el-avatar :size="30" :src="userStore.userInfo?.profile.avatarUrl" />
        <span class="ml-2 text-[14px]">{{ userStore.userInfo?.profile.nickname }}</span>
      </div>
    </div>
    <div class="play-container overflow-y-auto h-[calc(100%-80px)] px-[10px]">
      <template v-for="(menuItem, index) in asideMenuConfig" :key="index">
        <div v-if="menuItem.title && menuItem.list.length"></div>
        <template v-else>
          <div v-for="item in menuItem.list" :style="{ fontSize: item.asideFontSize + 'px' || '' }"
            :class="['play-list-item', { current: isCurrent(item.path) }]" @click="itemClick(item)">
            <i v-if="item.icon" :class="['iconfont', item.icon || '']" class="mr-[5px]"></i>
            <span>{{ item.name }}</span>
          </div>
        </template>
        <div v-if="index < asideMenuConfig.length - 1" class="h-[1px] bg-white mx-[10px] mt-[15px]"></div>
      </template>
    </div>
    <LoginBox v-if="loginVis" ref="loginBoxRef" @close-login="handleClose" />
  </div>

</template>
<script lang="ts" setup>
import LoginBox from './LoginBox.vue'
import { asideMenuConfig } from './asideConfig'
import { useUserStore } from '@/store';
import { ref, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginVis = ref(false)
const loginBoxRef = ref()
const handleLogin = () => {
  loginVis.value = true
  nextTick(() => {
    loginBoxRef.value.handleOpen()
  })
}

const handleUser = () => {
  router.push({
    path: '/userInfo',
    query: {
      uid: userStore.userInfo?.profile.userId,
      type:'my'
    }
  })
}
const handleClose = () => {
  loginVis.value = false
}

watch(
  () => route.path,
  (newPath) => {
    current.value = newPath
  },
  // { immediate: true }
)
const current = ref('/home')
const itemClick = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
const isCurrent = (path: string) => {
  return current.value === path
}

</script>
<style scoped lang="scss">
.aside {
  background-color: rgba(255, 255, 255, 0.03);
  .play-container {
    .play-list-item {
      cursor: pointer;
      font-size: 13px;
      text-align: left;
      line-height: 40px;
      padding: 0 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      margin: 7px 0;
      .name {
        margin-left: 10px;

      }
    }

    .play-list-item:hover {
      background-image: linear-gradient(#ff1168, #fc3d49);
    }

    .current.play-list-item {
      background-image: linear-gradient(#ff1168, #fc3d49);
    }
  }
}
</style>
