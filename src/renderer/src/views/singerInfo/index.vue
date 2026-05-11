<template>
  <div class="singerInfo mt-[15px]">
    <singerCard :user-info="singerInfo?.artist" :loading="loading" @play-all="playAllHandler" />
    <div class="hotSong mt-[10px]">
      <div class="text-[18px] cursor-pointer" @click="handleAll">
        热门歌曲>
      </div>
      <MusicList :needSearch="false" :columns="columns" :list="singerInfo?.hotSongs ?? []"
        @updateRuntimeList="handleUpdateRuntimeList" @play="handlePlay" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { columns } from '@/views/playList/musciList'
import MusicList from '@/views/playList/components/MusicList.vue';
import { useMusicStore } from '@/store'
import { watch, ref } from 'vue'
import { useRoute,useRouter } from 'vue-router';
import { getSingerDetailApi } from '@/api/search'
import type { singerDetail } from '@/types/search'
import singerCard from './components/singerCard.vue'
import { useThemeStore } from '@/store'

const musicStore = useMusicStore()

const route = useRoute()
const themeStore = useThemeStore()
const loading = ref<boolean>(false)
const singerInfo = ref<singerDetail | null>(null)
const getSingerIfno = async () => {
  if (!route.query.id) return
  loading.value = true
  const id = Number(route.query.id)
  const detail = await getSingerDetailApi(id)
  singerInfo.value = detail
  musicStore.currentItem = {
    id: detail.artist.id,
    name: '热门歌曲',
    specialType: 0,
    userId: 0,
    tracks: detail.hotSongs
  }
  themeStore.change(detail.artist.img1v1Url)
  loading.value = false
}

const handleUpdateRuntimeList = () => {

  musicStore.updateRuntimeList({ ...musicStore.currentItem });
  musicStore.orderStatusVal = 1
}
// 播放歌曲
const handlePlay = async (item, index) => {

  return await musicStore.getMusicUrlHandler(item, index)


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

const router = useRouter()
// 前往全部歌曲
const handleAll = () => {
  router.push({
    path:'/allSong',
    query:{
      id:Number(route.query.id),
      size: singerInfo.value?.artist.musicSize
    }

  })
}

watch(
  () => route.query.id,
  () => {
    getSingerIfno()
  },
  {
    immediate: true
  }
)

</script>

<style scoped lang="scss"></style>
