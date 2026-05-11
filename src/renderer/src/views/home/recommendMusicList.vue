<template>
  <div class="dailyList h-full flex flex-col min-h-0">
    <div class="listHead">
      <div class="title text-[24px] font-bold">
        每日推荐
      </div>
      <div class="headButton mt-[10px]">
        <el-button type="danger" style="width: 100px;" @click="playAllHandler">▶ 播放全部</el-button>
      </div>
    </div>
    <MusicList
      class="flex-1 min-h-0"
      :columns="columns"
      :list="userStore.dailyRecommendPlayList"
      @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList"
      :needSearch="false"
    />
  </div>

</template>

<script lang="ts" setup>
import MusicList from '@/views/playList/components/MusicList.vue'
import { columns } from '@/views/playList/musciList'
import { onMounted } from 'vue'
import { useUserStore, useMusicStore } from '@/store'

const userStore = useUserStore()
const musicStore = useMusicStore()

onMounted(() => {
  musicStore.clearCurrentItem
  musicStore.currentItem = {
    id: 0,
    name: '每日推荐',
    specialType: 0,
    userId: 0,
    tracks: userStore.dailyRecommendPlayList
  }
})

const handleUpdateRuntimeList = () => {
  musicStore.updateRuntimeList({ tracks: userStore.dailyRecommendPlayList, id: 0, specialType: 0 })
  musicStore.orderStatusVal = 1
}

// 播放全部
const playAllHandler = () => {
  handleUpdateRuntimeList()
  musicStore.initPlay()
}

// 播放歌曲
const handlePlay = async (item, index) => {
  const type = musicStore.orderStatusVal
  if (type !== 0) {
    return await musicStore.getMusicUrlHandler(item, index)
  } else {
    await musicStore.getMusicUrlHandler(item, 0)
    await musicStore.getintelligenceList()
  }
}

</script>

<style scoped lang="scss"></style>
