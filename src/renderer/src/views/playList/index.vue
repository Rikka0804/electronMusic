<template>
  <ListInfo :loading="InfoLoading"/>
  <MusicList />


</template>

<script setup lang="ts">
import ListInfo from './components/ListInfo.vue';
import MusicList from './components/MusicList.vue';
import {getPlayListDetailApi} from '@/api/musicLits'
import { useRoute } from 'vue-router';
import { useMusicStore } from '@/store/index';
import { ref } from 'vue';
const route = useRoute()
const musicStore = useMusicStore()
const id = Number(route.query.id)
const InfoLoading = ref<boolean>(true)
const getPlayListDetail = async () => {
  InfoLoading.value = true
  musicStore.clearCurrentItem()
  const res = await getPlayListDetailApi(id)
  musicStore.updateCurrentItem(res.playlist)
  InfoLoading.value = false
}
getPlayListDetail()

</script>

<style scoped lang="scss">

</style>
