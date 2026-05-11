<template>
  <div ref="dailyListRef" class="dailyList">
    <div class="listHead">
      <div class="title text-[24px] font-bold">
        全部歌曲
      </div>
      <div class="headButton mt-[10px]">
        <el-button type="danger" style="width: 100px;" @click="playAllHandler">▶ 播放全部</el-button>
      </div>
    </div>
    <MusicList
      :columns="columns"
      :list="allSongs"
      :needSearch="false"
      :loading="loading"
      @play="handlePlay"
      @updateRuntimeList="handleUpdateRuntimeList"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElLoading } from 'element-plus'
import { useRoute } from 'vue-router'
import { getSingerAllSongApi } from '@/api/search'
import { useMusicStore } from '@/store'
import type { GetMusicDetailData } from '@/types/musicList'
import MusicList from '@/views/playList/components/MusicList.vue'
import { columns } from '@/views/playList/musciList'

const musicStore = useMusicStore()
const route = useRoute()

const dailyListRef = ref<HTMLDivElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const allSongs = ref<GetMusicDetailData[]>([])
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const reachBottomLock = ref(false)
const total = computed(() => Number(route.query.size) || 0)

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

const updateCurrentItem = (id: number) => {
  musicStore.currentItem = {
    id,
    name: '全部歌曲',
    specialType: 0,
    userId: 0,
    tracks: allSongs.value
  }
}

const getAllSong = async (id: number, isLoadMore = false) => {
  if (isLoadMore) {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    openFullScreenLoading()
  } else {
    loading.value = true
    hasMore.value = true
    reachBottomLock.value = false
    allSongs.value = []
  }

  try {
    const offset = isLoadMore ? allSongs.value.length : 0
    const { songs = [] } = await getSingerAllSongApi(id, offset)
    const nextSongs = isLoadMore ? [...allSongs.value, ...songs] : songs

    allSongs.value = nextSongs
    updateCurrentItem(id)

    if (musicStore.runtimeList?.id === id) {
      musicStore.updateTracks(nextSongs)
    }

    hasMore.value = songs.length > 0 && (total.value === 0 || nextSongs.length < total.value)
  } finally {
    if (isLoadMore) {
      isLoadingMore.value = false
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

const handleScroll = () => {
  if (loading.value || isLoadingMore.value || !hasMore.value) return

  const target = scrollContainerRef.value
  if (!target) return

  const { scrollTop, clientHeight, scrollHeight } = target
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 80

  if (!isNearBottom) {
    reachBottomLock.value = false
    return
  }

  if (reachBottomLock.value) return

  reachBottomLock.value = true
  getAllSong(Number(route.query.id), true)
}

watch(
  () => [route.query.id, route.query.size],
  ([id]) => {
    if (!id) return
    getAllSong(Number(id))
  },
  { immediate: true }
)

onMounted(() => {
  scrollContainerRef.value = dailyListRef.value?.closest('.content-box') ?? null
  scrollContainerRef.value?.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  scrollContainerRef.value?.removeEventListener('scroll', handleScroll)
  closeFullScreenLoading()
})
</script>

<style scoped lang="scss"></style>
