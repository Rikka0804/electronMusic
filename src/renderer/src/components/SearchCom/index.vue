<template>
  <div ref="containerRef" class="search-container flex items-center px-[15px]">
    <el-icon
      class="search-icon cursor-pointer"
      size="18px"
      color="rgba(255, 255, 255, 0.5)"
      @click="handleSearch()"
    >
      <Search />
    </el-icon>
    <input
      ref="inputRef"
      v-model.trim="keywords"
      class="search-input bg-transparent w-[230px] h-[37px] pl-[10px] outline-none border-none font-size-[14px] text-white placeholder:text-white/50"
      type="text"
      :placeholder="placeholderText"
      @focus="openSuggest"
      @click="openSuggest"
      @keyup.enter="handleSearch()"
    />
    <el-icon
      class="clean-icon cursor-pointer"
      size="18px"
      color="rgba(255, 255, 255, 0.5)"
      :class="{ visible: showClearIcon }"
      @mousedown.prevent
      @click="handleClear"
    >
      <CircleCloseFilled />
    </el-icon>
    <div
      v-show="showSuggest"
      class="suggest app-scrollbar"
      v-loading="loading"
      element-loading-background="transparent"
    >
      <list
        :list="hotList"
        :model="suggestMode"
        :keywordsList="suggestions"
        @select="handleSearch($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import list from './list.vue'
import { getDefaultSearchApi, getHotSearchApi, getSearchSuggestApi } from '@/api/search'
import type { searchSongAllMatchItem, searchSongItem } from '@/types/search'

const route = useRoute()
const router = useRouter()

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const keywords = ref('')
const loading = ref(false)
const showSuggest = ref(false)
const hotList = ref<searchSongItem[]>([])
const suggestions = ref<searchSongAllMatchItem[]>([])
const placeholderInfo = ref({
  realkeyword: '',
  showKeyword: ''
})

const placeholderText = computed(() => placeholderInfo.value.showKeyword || '搜索')
const suggestMode = computed<'hot' | 'keywords'>(() => (keywords.value ? 'keywords' : 'hot'))
const showClearIcon = computed(() => keywords.value.length > 0)

let suggestTimer: ReturnType<typeof setTimeout> | null = null
let latestSuggestRequestId = 0

const resetPendingSuggest = () => {
  if (suggestTimer) {
    clearTimeout(suggestTimer)
    suggestTimer = null
  }

  latestSuggestRequestId += 1
  loading.value = false
}

const openSuggest = () => {
  showSuggest.value = true
}

const closeSuggest = () => {
  showSuggest.value = false
  resetPendingSuggest()
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatSuggestions = (items: searchSongAllMatchItem[], keyword: string) => {
  if (!keyword) {
    return items.map((item) => ({ ...item, text: escapeHtml(item.keyword) }))
  }

  const regExp = new RegExp(escapeRegExp(keyword), 'ig')
  return items.map((item) => {
    const rawText = item.keyword
    let lastIndex = 0
    let html = ''

    for (const match of rawText.matchAll(regExp)) {
      const matchedText = match[0]
      const index = match.index ?? 0

      html += escapeHtml(rawText.slice(lastIndex, index))
      html += `<span style="color:lightskyblue">${escapeHtml(matchedText)}</span>`
      lastIndex = index + matchedText.length
    }

    html += escapeHtml(rawText.slice(lastIndex))

    return {
      ...item,
      text: html
    }
  })
}

const loadSearchBaseData = async () => {
  const [defaultSearchRes, hotSearchRes] = await Promise.allSettled([
    getDefaultSearchApi(),
    getHotSearchApi()
  ])

  if (defaultSearchRes.status === 'fulfilled') {
    placeholderInfo.value.realkeyword = defaultSearchRes.value.data.realkeyword
    placeholderInfo.value.showKeyword = defaultSearchRes.value.data.showKeyword
  }

  if (hotSearchRes.status === 'fulfilled') {
    hotList.value = hotSearchRes.value.data
  }
}

const fetchSuggestions = async (keyword: string) => {
  const requestId = ++latestSuggestRequestId
  loading.value = true

  try {
    const { result } = await getSearchSuggestApi(keyword, 'mobile')
    if (requestId !== latestSuggestRequestId || keyword !== keywords.value) return

    suggestions.value = formatSuggestions(result?.allMatch ?? [], keyword)
  } catch (error) {
    if (requestId !== latestSuggestRequestId) return
    suggestions.value = []
    console.error('获取搜索建议失败:', error)
  } finally {
    if (requestId === latestSuggestRequestId) {
      loading.value = false
    }
  }
}

const scheduleSuggestFetch = (keyword: string) => {
  resetPendingSuggest()

  if (!keyword) {
    suggestions.value = []
    return
  }

  suggestTimer = setTimeout(() => {
    fetchSuggestions(keyword)
    suggestTimer = null
  }, 300)
}

const handleClear = () => {
  keywords.value = ''
  openSuggest()
  inputRef.value?.focus()
}

const getSearchTarget = (selectedKeyword?: string) => {
  return (selectedKeyword || keywords.value || placeholderInfo.value.showKeyword || placeholderInfo.value.realkeyword).trim()
}

const handleSearch = async (selectedKeyword?: string) => {
  const targetKeyword = getSearchTarget(selectedKeyword)
  if (!targetKeyword) return

  keywords.value = targetKeyword
  closeSuggest()

  if (route.path === '/search' && route.query.keywords === targetKeyword) {
    return
  }

  await router.push({
    path: '/search',
    query: {
      keywords: targetKeyword
    }
  })
}

const handleDocumentMouseDown = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (!target) return
  if (containerRef.value?.contains(target)) return
  closeSuggest()
}

watch(
  () => [route.path, route.query.keywords],
  ([path, routeKeywords]) => {
    if (path !== '/search') return
    keywords.value = typeof routeKeywords === 'string' ? routeKeywords : ''
  },
  { immediate: true }
)

watch(keywords, (value) => {
  if (!showSuggest.value) {
    if (!value) {
      suggestions.value = []
    }
    return
  }

  scheduleSuggestFetch(value)
})

watch(showSuggest, (visible) => {
  if (!visible) return
  scheduleSuggestFetch(keywords.value)
})

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown)
  void loadSearchBaseData()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown)
  resetPendingSuggest()
})
</script>

<style scoped lang="scss">
.search-container {
  position: relative;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .clean-icon {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  &:hover {
    .clean-icon.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .suggest {
    position: absolute;
    border-radius: 10px;
    width: 380px;
    max-height: 77vh;
    background-color: rgba(45, 45, 56, 1);
    transform: translateX(-50%) translateY(100%);
    left: 50%;
    bottom: -2vh;
    z-index: 10;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }
}
</style>
