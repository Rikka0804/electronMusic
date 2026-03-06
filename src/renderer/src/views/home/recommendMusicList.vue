<template>
  <div class="dailyList">
    <div class="listHead">
      <div class="title text-[24px] font-bold">
        每日推荐
      </div>
      <div class="headButton mt-[10px]">
        <el-button type="danger" style="width: 100px;" @click="playAllHandler">▶ 播放全部</el-button>
      </div>
    </div>
    <MusicList :columns="columns" :list="userStore.dailyRecommendPlayList" @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList" />
  </div>

</template>

<script lang="ts" setup>
import MusicList from '@/views/playList/components/MusicList.vue';
import { columns } from '@/views/playList/musciList'
import { onMounted, computed } from 'vue';
import { useUserStore, useMusicStore } from '@/store';
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
const dailyIds = computed(() => {
  return userStore.dailyRecommendPlayList.map(i => i.id)
})

const handleUpdateRuntimeList = () => {


  musicStore.updateRuntimeList({ tracks: userStore.dailyRecommendPlayList, id: 0, specialType: 0 }, dailyIds.value);
  musicStore.orderStatusVal = 1
}

// 播放全部
const playAllHandler = () => {

  // 点击播放全部时，判断当前播放列表是否为当前播放列表
  // if (musicStore.runtimeList?.id === playListState.listInfo.id) {
  //   return
  // }
  handleUpdateRuntimeList()
  musicStore.initPlay()

}

// 播放歌曲
const handlePlay = async (item, index) => {

  const type = musicStore.orderStatusVal
  // 非心动模式
  if (type !== 0) {
    return await musicStore.getMusicUrlHandler(item, index)
  }
  else {
    // 心动模式 将当前歌曲作为第一首，点击重新获取新的心动歌曲列表
    await musicStore.getMusicUrlHandler(item, 0)
    await musicStore.getintelligenceList()
  }

}


</script>

<style scoped lang="scss"></style>
