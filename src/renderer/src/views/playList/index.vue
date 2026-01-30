<template>
  <div class="w-full">
    <ListInfo :loading="playListState.loading"/>
    <MusicList v-if="!playListState.loading" :columns="columns" :list="playListState.playList" @play="handlePlay"  @updateRuntimeList="handleUpdateRuntimeList"/>
  </div>
</template>

<script setup lang="ts">
import ListInfo from './components/ListInfo.vue';
import MusicList from './components/MusicList.vue';
import { columns } from './musciList'

import { useRoute } from 'vue-router';


import { usePlayList } from '@/composables/usePlayList';
const{ playListState, getPlayListDetail} = usePlayList()
const route = useRoute()
const id = Number(route.query.id)
getPlayListDetail(id)

import { useMusicStore } from '@/store'
const musicStore = useMusicStore()

const handleUpdateRuntimeList = () => {
  musicStore.updateRuntimeList({tracks: playListState.playList,...playListState.listInfo}, playListState.ids);
  musicStore.orderStatusVal = 1
}

// 播放歌曲
const handlePlay = async (item , index) => {

  const type = musicStore.orderStatusVal
  // 非心动模式
  if(type !== 0) {
    return await musicStore.getMusicUrlHandler(item,index)
  }
  else{
    // 心动模式 将当前歌曲作为第一首，点击重新获取新的心动歌曲列表
   await musicStore.getMusicUrlHandler(item,0)
   await musicStore.getintelligenceList()
  }

}



</script>

<style scoped lang="scss">

</style>
