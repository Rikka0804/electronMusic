<template>
  <div class="w-full">
    <ListInfo :loading="playListState.loading"/>
    <MusicList v-if="!playListState.loading" :columns="columns" :list="playListState.playList" @play="musicStore.getMusicUrlHandler"  @updateRuntimeList="handleUpdateRuntimeList"/>
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




</script>

<style scoped lang="scss">

</style>
