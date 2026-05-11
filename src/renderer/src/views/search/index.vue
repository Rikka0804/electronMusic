<template>
  <div class="searchPage h-full flex flex-col ">
    <div class="pageTitle text-[24px] font-bold w-[80%] overflow-hidden whitespace-nowrap text-ellipsis mb-[10px]">
      {{ route.query.keywords }}
    </div>
    <div class="pageContent flex-1 min-h-0 flex flex-col">
      <Tabs :list="list" v-model="currentList" />
      <div
        class="searchLoading min-h-0 h-[50px]"
        v-show="loading"
        v-loading="loading"
        element-loading-background="transparent"
      />
      <div class="min-h-0 flex-1" v-show="!loading">
        <searchAll v-if="currentList === 'all'" :all-state="allState" @change-tab="handleChangeTab" />
        <searchMusic v-if="currentList === 'music'" />
        <searchSongList v-if="currentList === 'musicList'" />
        <searchSinger v-if="currentList === 'singer'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { list } from './config'
import { useMusicStore } from '@/store'
import { getSearchMusictApi, getSearchSingerApi, getSearchSongListApi } from '@/api/search'
import type { PlayList, GetMusicDetailData } from '@/types/musicList'
import type { searchSingerItem } from '@/types/search'

const searchAll = defineAsyncComponent(() => import('./components/searchAll.vue'))
const searchMusic = defineAsyncComponent(() => import('./components/searchMusic.vue'))
const searchSongList = defineAsyncComponent(() => import('./components/searchMusicList.vue'))
const searchSinger = defineAsyncComponent(() => import('./components/searchSinger.vue'))

const route = useRoute()
const musicStore = useMusicStore()

interface SearchResult {
  songs: GetMusicDetailData[]
  songCount: number
  singers: searchSingerItem[]
  songLists: PlayList[]
}

const loading = ref(true)
const allState = ref<SearchResult>({
  singers: [],
  songs: [],
  songCount: 0,
  songLists: []
})
const currentList = ref(list[0].name)

const initCurrentItem = (keywords: string, musicList: GetMusicDetailData[]) => {
  musicStore.currentItem = {
    id: keywords,
    name: '搜索',
    specialType: 0,
    userId: 0,
    tracks: musicList
  }
}

const initAll = async (keywords: string) => {
  loading.value = true
  allState.value = {
    singers: [],
    songs: [],
    songLists: [],
    songCount: 0
  }

  try {
    const [musicRes, singerRes, songListRes] = await Promise.all([
      getSearchMusictApi({ keywords, type: 1, limit: 6 }),
      getSearchSingerApi({ keywords, type: 100, limit: 4 }),
      getSearchSongListApi({ keywords, type: 1000, limit: 4 })
    ])

    allState.value.songs = musicRes.result.songs
    allState.value.songCount = musicRes.result.songCount
    allState.value.singers = singerRes.result.artists
    allState.value.songLists = songListRes.result.playlists
    initCurrentItem(keywords, musicRes.result.songs)
  } catch (err) {
    console.error('搜索接口失败:', err)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.keywords,
  (keywords) => {
    if (!keywords || typeof keywords !== 'string') return
    currentList.value = list[0].name
    initAll(keywords)
  },
  {
    immediate: true
  }
)

const handleChangeTab = (tab: 'music' | 'musicList' | 'singer') => {
  currentList.value = tab
}
</script>

<style scoped lang="scss">
</style>
