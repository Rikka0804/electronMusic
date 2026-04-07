<template>
  <div class="searchPage">
    <div class="pageTitle text-[24px] font-bold w-[80%] overflow-hidden whitespace-nowrap text-ellipsis mb-[10px]">
      {{ route.query.keywords }}
    </div>
    <div class="pageContent">
      <Tabs :list="list" v-model="currentList">
      </Tabs>
      <searchAll v-if="currentList === 'all'"></searchAll>
      <searchMusic v-if="currentList === 'music'"></searchMusic>
      <searchSongList v-if="currentList === 'musicList'"></searchSongList>
      <searchSinger v-if="currentList === 'singer'"></searchSinger>

    </div>
  </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { list } from './config'
import { getSearchMusictApi, getSearchSingerApi, getSearchSongListApi } from '@/api/search'
import type { PlayList, GetMusicDetailData } from '@/types/musicList'
import type { searchSingerItem } from '@/types/search'
const searchAll = defineAsyncComponent(() => import('./components/searchAll.vue'))
const searchMusic = defineAsyncComponent(() => import('./components/searchMusic.vue'))
const searchSongList = defineAsyncComponent(() => import('./components/searchMusicList.vue'))
const searchSinger = defineAsyncComponent(() => import('./components/searchSinger.vue'))
const route = useRoute()

interface SearchResult {
  songs: GetMusicDetailData[],
  singers: searchSingerItem[],
  songLists: PlayList[]
}
// 综合
const allState = ref<SearchResult>({
  singers: [],
  songs: [],
  songLists: []
})

const initAll = async (keywords: string) => {
  allState.value = {
    singers: [],
    songs: [],
    songLists: []
  }

  try {
    const [musicRes, singerRes, songListRes] = await Promise.all([
      getSearchMusictApi({ keywords, type: 1, limit: 6 }),
      getSearchSingerApi({ keywords, type: 100, limit: 4 }),
      getSearchSongListApi({ keywords, type: 1000, limit: 4 })
    ])
    allState.value.songs = musicRes.result.songs
    allState.value.singers = singerRes.result.artists
    allState.value.songLists = songListRes.result.playlists




  } catch (err) {
    console.error('搜索接口失败:', err)
  }

}

onMounted(() => {
  initAll(route.query.keywords as string)
})

// 分页
const page = ref({
  limit: 10,
  offset: 0
})
//单曲
const singleState = ref<{ songs: GetMusicDetailData[] }>({
  songs: []
})

// 歌单
const songListState = ref<{ songLists: PlayList[] }>({
  songLists: []
})

// 歌手
const singerState = ref<{ singers: searchSingerItem[] }>({
  singers: []
})

const currentList = ref(list[0].name)


</script>

<style scoped lang="scss"></style>
