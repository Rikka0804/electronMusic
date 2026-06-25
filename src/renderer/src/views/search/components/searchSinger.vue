<template>
  <div class="search-singer h-full min-h-0 overflow-hidden">
    <div
      ref="singerListRef"
      class="singer-list app-scrollbar h-full overflow-y-auto"
      v-loading="loading"
      element-loading-background="transparent"
      @scroll="handleSingerListScroll"
    >
      <div v-if="singers.length" class="singer-grid">
        <SingerItem v-for="singer in singers" :key="singer.id" :singer="singer" />
      </div>
      <div v-else-if="!loading" class="empty-singer h-[120px] flex items-center justify-center text-[14px] opacity-60">
        暂无相关歌手
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElLoading } from 'element-plus'
import { useRoute } from 'vue-router'
import { getSearchSingerApi } from '@/api/search'
import type { searchSingerItem } from '@/types/search'
import SingerItem from './singerItem.vue'

const route = useRoute()

const singers = ref<searchSingerItem[]>([])
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const reachBottomLock = ref(false)
const singerListRef = ref<HTMLElement>()

let fullScreenLoading: ReturnType<typeof ElLoading.service> | null = null

function openFullScreenLoading() {
  if (fullScreenLoading) return

  fullScreenLoading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(200, 200, 200, 0.4)'
  })
}

function closeFullScreenLoading() {
  fullScreenLoading?.close()
  fullScreenLoading = null
}

function resetSingerListScroll() {
  singerListRef.value?.scrollTo({
    top: 0
  })
}

async function loadSearchSingers(keywords: string, isLoadMore = false) {
  if (isLoadMore) {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    openFullScreenLoading()
  } else {
    loading.value = true
    hasMore.value = true
    reachBottomLock.value = false
    singers.value = []
    resetSingerListScroll()
  }

  try {
    const offset = isLoadMore ? singers.value.length : 0
    const { result } = await getSearchSingerApi({
      keywords,
      type: 100,
      limit: 40,
      offset
    })

    const nextSingers = isLoadMore ? [...singers.value, ...result.artists] : result.artists

    singers.value = nextSingers
    hasMore.value = nextSingers.length < result.artistCount
  } catch (error) {
    console.error('搜索歌手失败:', error)
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

function handleSingerListScroll(event: Event) {
  const keywords = route.query.keywords
  if (!keywords || typeof keywords !== 'string') return
  if (loading.value || isLoadingMore.value || !hasMore.value) return
  if (reachBottomLock.value) return

  const target = event.target as HTMLElement
  const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
  if (distanceToBottom > 80) return

  reachBottomLock.value = true
  loadSearchSingers(keywords, true)
}

watch(
  () => route.query.keywords,
  (keywords) => {
    if (!keywords || typeof keywords !== 'string') return
    closeFullScreenLoading()
    loadSearchSingers(keywords)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.singer-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-items: center;
  column-gap: 18px;
  row-gap: 24px;
  padding-bottom: 24px;
}
</style>
