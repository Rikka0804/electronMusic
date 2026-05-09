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
    <MusicList :columns="columns" :list="allSongs ?? []" @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList" :needSearch="false" :loading="loading"/>
  </div>

</template>

<script lang="ts" setup>
import MusicList from '@/views/playList/components/MusicList.vue';
import { columns } from '@/views/playList/musciList'
import { onMounted, ref } from 'vue';
import { getSingerAllSongApi } from '@/api/search'
import { useRoute } from 'vue-router';
import { useMusicStore } from '@/store';
import { GetMusicDetailData } from '@/types/musicList'
const musicStore = useMusicStore()
const route = useRoute()


const allSongs = ref<GetMusicDetailData[]>()
const loading = ref<boolean>(true)
const getAllSong = async (id: number) => {
  loading.value = true
  const allSong = await getSingerAllSongApi(id)
  allSongs.value = allSong.songs
  musicStore.currentItem = {
    id,
    name: '全部歌曲',
    specialType: 0,
    userId: 0,
    tracks: allSong.songs
  }
  loading.value = false
}
const handleUpdateRuntimeList = () => {


  musicStore.updateRuntimeList({ ...musicStore.currentItem });
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

onMounted(() => {
  const id = route.query.id
  getAllSong(Number(id))
})
</script>

<style scoped lang="scss"></style>
