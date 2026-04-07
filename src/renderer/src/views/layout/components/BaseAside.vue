<template>
  <div class="aside h-full w-[195px] box-border flex flex-col">
    <div class="avator-box flex shrink-0">
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
    <div class="play-container app-scrollbar min-h-0 flex-1 overflow-y-auto px-[10px] pb-[12px]">
      <template v-for="(menuItem, index) in asideMenuConfig" :key="index">
        <!-- 我的创建我的收藏歌单 -->
        <div v-if="menuItem.title" class="my-[7px] ">
          <div class="text-[13px] px-[10px] font-bold text-white/80 flex justify-between items-center">
            <div class="cursor-pointer" @click="menuItem.isCollapsed = !menuItem.isCollapsed">
              <span>{{ menuItem.title }}</span>
              <span class="ml-[5px]">{{ menuItem.list.length || '' }} </span>
              <span class="ml-[5px]">
                <el-icon v-if="menuItem.isCollapsed">
                  <ArrowUpBold />
                </el-icon>
                <el-icon v-else>
                  <ArrowDownBold />
                </el-icon>
              </span>
            </div>
            <div v-if="menuItem.mark == 'myCreateList'" class="cursor-pointer">
              <el-icon>
                <CirclePlusFilled />
              </el-icon>
            </div>
          </div>
          <div class="list-group text-[13px]" v-show="menuItem.isCollapsed">
            <div class="musiclist-item flex items-center px-[10px] mt-[8px] py-[5px] cursor-pointer"
              :class="{ 'current': isCurrent(item.path, item.id) }" v-for="item in menuItem.list" :key="item.id"
              @click="itemClick(item)">
              <img :src="item.coverImgUrl + '?param=150y150'" alt="" class="w-[38px] h-[38px]">
              <div class="item-name ml-[5px]">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 基础菜单 -->
        <div v-else>
          <div v-for="item in menuItem.list" :style="{ fontSize: item.asideFontSize + 'px' || '' }"
            :class="['play-list-item', { current: isCurrent(item.path, item.id) }]" @click="itemClick(item)">
            <i v-if="item.icon" :class="['iconfont', item.icon || '']" class="mr-[5px]"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div v-if="index < asideMenuConfig.length - 1" class="mx-[10px] mt-[14px] border-t-[1.5px] border-white/10">
        </div>

      </template>
    </div>
    <LoginBox v-if="loginVis" ref="loginBoxRef" @close-login="handleClose" />
  </div>

</template>
<script lang="ts" setup>
import LoginBox from './LoginBox.vue'

import { useUserStore } from '@/store';
import { ref, nextTick, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// const { asideMenu } = storeToRefs(userStore)
const asideMenuConfig = computed(() => {
  return userStore.asideMenu
})
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
      type: 'my'
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
const currentId = ref(1)
const itemClick = (item) => {
  if (item.path) {
    currentId.value = item.id
    router.push({
      path: item.path,
      query: {
        id: item.id
      }
    })
  }
}
const isCurrent = (path: string, id) => {
  return current.value === path && currentId.value == id
}

</script>
<style scoped lang="scss">
.aside {
  background-color: rgba(255, 255, 255, 0.03);

  .play-container {
    overscroll-behavior: contain;
    scrollbar-gutter: stable;

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

    .musiclist-item {
      border-radius: 5px;

      img {
        border-radius: 5px;
      }

      .item-name {
        @include textOverflow(2)
      }
    }

    .musiclist-item:hover {
      background-image: linear-gradient(to right, rgba(255, 17, 104, 0.8), rgba(252, 61, 73, 0.3));
    }

    .current.musiclist-item {
      background-image: linear-gradient(to right, rgba(255, 17, 104, 0.8), rgba(252, 61, 73, 0.7));
    }

    .play-list-item:hover {
      background-image: linear-gradient(to right, rgba(255, 17, 104, 0.8), rgba(252, 61, 73, 0.3));
    }

    .current.play-list-item {
      background-image: linear-gradient(to right, rgba(255, 17, 104, 0.8), rgba(252, 61, 73, 0.7));
    }
  }
}
</style>
