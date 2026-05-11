<template>
  <div class="search-music h-full flex flex-col min-h-0">
    <div class="listHead shrink-0">
      <div class="headButton mt-[10px]">
        <el-button type="danger" style="width: 100px;" :disabled="loading || songs.length === 0" @click="playAllHandler">播放全部</el-button>
      </div>
    </div>

    <MusicList
      class="flex-1 min-h-0"
      :columns="columns"
      :list="songs"
      :needSearch="false"
      :loading="loading"
      :forceVirtual="forceVirtual"
      @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList"
      @reachBottom="handleReachBottom"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElLoading } from 'element-plus'
import { useRoute } from 'vue-router'
import { getSearchMusictApi } from '@/api/search'
import { useMusicStore } from '@/store'
import type { GetMusicDetailData } from '@/types/musicList'
import MusicList from '@/views/playList/components/MusicList.vue'
import { MUSIC_LIST_VIRTUAL_THRESHOLD, columns } from '@/views/playList/musciList'

const route = useRoute()
const musicStore = useMusicStore()

const songs = ref<GetMusicDetailData[]>([])
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const reachBottomLock = ref(false)
const songCount = ref(0)
const forceVirtual = computed(() => songCount.value >= MUSIC_LIST_VIRTUAL_THRESHOLD)

let fullScreenLoading: ReturnType<typeof ElLoading.service> | null = null

const openFullScreenLoading = () => {
  if (fullScreenLoading) return

  fullScreenLoading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(200, 200, 200, 0.4)'
  })
}

const closeFullScreenLoading = () => {
  fullScreenLoading?.close()
  fullScreenLoading = null
}

const updateCurrentItem = (keywords: string) => {
  musicStore.currentItem = {
    id: keywords,
    name: '搜索',
    specialType: 0,
    userId: 0,
    tracks: songs.value
  }
}

const getSearchMusic = async (keywords: string, isLoadMore = false) => {
  if (isLoadMore) {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    openFullScreenLoading()
  } else {
    loading.value = true
    hasMore.value = true
    reachBottomLock.value = false
    songs.value = []
    songCount.value = 0
  }

  try {
    const offset = isLoadMore ? songs.value.length : 0
    const { result } = await getSearchMusictApi({
      keywords,
      type: 1,
      limit: 50,
      offset
    })

    const nextSongs = isLoadMore ? [...songs.value, ...result.songs] : result.songs

    songs.value = nextSongs
    songCount.value = result.songCount
    updateCurrentItem(keywords)

    if (musicStore.runtimeList?.id === keywords) {
      musicStore.updateTracks(nextSongs)
    }

    hasMore.value = nextSongs.length < result.songCount
  } finally {
    if (isLoadMore) {
      isLoadingMore.value = false
      reachBottomLock.value = false
      closeFullScreenLoading()
    } else {
      loading.value = false
    }
  }
}

const handleUpdateRuntimeList = () => {
  musicStore.updateRuntimeList({ ...musicStore.currentItem })
  musicStore.orderStatusVal = 1
}

const playAllHandler = () => {
  handleUpdateRuntimeList()
  musicStore.initPlay()
}

const handlePlay = async (item: GetMusicDetailData, index: number) => {
  if (musicStore.orderStatusVal !== 0) {
    return await musicStore.getMusicUrlHandler(item, index)
  }

  await musicStore.getMusicUrlHandler(item, 0)
  await musicStore.getintelligenceList()
}

const handleReachBottom = () => {
  const keywords = route.query.keywords
  if (!keywords || typeof keywords !== 'string') return
  if (loading.value || isLoadingMore.value || !hasMore.value) return
  if (reachBottomLock.value) return

  reachBottomLock.value = true
  getSearchMusic(keywords, true)
}

watch(
  () => route.query.keywords,
  (keywords) => {
    if (!keywords || typeof keywords !== 'string') return
    closeFullScreenLoading()
    getSearchMusic(keywords)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>
