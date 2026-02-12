<template>
  <div class="w-full">
    <ListInfo :loading="playListState.InfoLoading" @playAll="playAllHandler" :listInfo="playListState.listInfo" />
    <MusicList v-if="!playListState.InfoLoading" :loading="playListState.listLoading" :columns="columns" :list="playListState.playList" :listInfo="playListState.listInfo" @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList" />
  </div>
</template>

<script setup lang="ts">
import ListInfo from './components/ListInfo.vue';
import MusicList from './components/MusicList.vue';
import { columns } from './musciList'
import { watch } from 'vue'
import { useRoute } from 'vue-router';
import { useMusicStore } from '@/store'

import { usePlayList } from '@/composables/usePlayList';
const { playListState, getPlayListDetail } = usePlayList()



const route = useRoute()

watch(
  () => route.query.id,
  (id) => {
    if (!id) return
    getPlayListDetail(Number(id))
  },
  { immediate: true }
)


const musicStore = useMusicStore()

const handleUpdateRuntimeList = () => {
  musicStore.updateRuntimeList({ tracks: playListState.playList, ...playListState.listInfo }, playListState.ids);
  musicStore.orderStatusVal = 1
}

// 播放全部
const playAllHandler = () => {


  // 点击播放全部时，判断当前播放列表是否为当前播放列表
  if (musicStore.runtimeList?.id === playListState.listInfo.id) {
    return
  }
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
