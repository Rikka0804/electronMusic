<template>
  <ListInfo />


</template>

<script setup lang="ts">
import ListInfo from './components/ListInfo.vue';
import {getPlayListDetailApi} from '@/api/musicLits'
import { useRoute } from 'vue-router';
import { useMusicStore } from '@/store/index';
const route = useRoute()
const musicStore = useMusicStore()
const id = Number(route.query.id)

const getPlayListDetail = async () => {
  const res = await getPlayListDetailApi(id)
  musicStore.updateCurrentItem(res.playlist)
}
getPlayListDetail()

</script>

<style scoped lang="scss">

</style>
