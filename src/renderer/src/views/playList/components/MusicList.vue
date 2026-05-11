<template>
  <div v-if="!loading && list.length > 0" class="musicList flex h-full min-h-0 flex-col pt-[15px]">
    <div v-if="needSearch" class="search shrink-0">
      <el-input
        v-model="searchKey"
        prefix-icon="Search"
        clearable
        placeholder="搜索"
        :class="{ active: isFocus || searchKey }"
        @focus="isFocus = true"
        @blur="isFocus = false"
      />
    </div>

    <div class="list flex min-h-0 flex-1 flex-col pt-[15px]">
      <div v-if="needTitle" class="list-title shrink-0">
        <div
          v-for="config in normalizedColumns"
          v-show="!config.hidden"
          :key="config.title"
          class="title-item"
          :class="config.class"
          :style="config._style"
        >
          {{ config.title }}
        </div>
      </div>

      <RecycleScroller
        v-if="virtualEnabled && displayList.length"
        class="list-container app-scrollbar mt-[10px]"
        :items="displayList"
        :item-size="ROW_HEIGHT"
        key-field="id"
        :buffer="ROW_HEIGHT * 4"
        @scroll-end="handleScrollEnd"
        v-slot="{ item, index }"
      >
        <MusicListRow
          :item="item"
          :index="index"
          :columns="normalizedColumns"
          :active="currentId === item.id"
          :playing="musicStore.songs?.id === item.id"
          :is-like="isLike(item)"
          :menu-items="getContextMenuList(props.type, item)"
          @play="playHandler"
          @activate="currentId = $event"
          @go-singer="goSinger"
          @menu-select="handleContextMenuSelect"
        />
      </RecycleScroller>

      <div v-else-if="displayList.length" class="list-container app-scrollbar mt-[10px]">
        <MusicListRow
          v-for="(item, index) in displayList"
          :key="item.id"
          :item="item"
          :index="index"
          :columns="normalizedColumns"
          :active="currentId === item.id"
          :playing="musicStore.songs?.id === item.id"
          :is-like="isLike(item)"
          :menu-items="getContextMenuList(props.type, item)"
          @play="playHandler"
          @activate="currentId = $event"
          @go-singer="goSinger"
          @menu-select="handleContextMenuSelect"
        />
      </div>

      <div v-else class="empty flex flex-1 items-center justify-center text-[14px] text-white/50">
        暂无结果
      </div>
    </div>
  </div>
  <div v-else v-loading="props.loading" class="h-[80px]" element-loading-background="transparent"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { formattingTime } from '@/utils/utils'
import { MUSIC_LIST_VIRTUAL_THRESHOLD, type Columns } from '../musciList'
import type { GetMusicDetailData, PlayList } from '@/types/musicList'
import { useUserStore, useMusicStore } from '@/store'
import { useRouter } from 'vue-router'
import MusicListRow from './MusicListRow.vue'

interface Props {
  columns: Columns[]
  list: GetMusicDetailData[]
  listInfo?: PlayList
  needSearch?: boolean
  needTitle?: boolean
  loading?: boolean
  type?: 'playList' | 'drawerList'
  virtualThreshold?: number
  forceVirtual?: boolean
}

interface MenuItem {
  label: string
  value: string
}

type MusicListItem = GetMusicDetailData & {
  _duration: string
  _searchText: string
}

const props = withDefaults(defineProps<Props>(), {
  needSearch: true,
  needTitle: true,
  loading: false,
  type: 'playList',
  virtualThreshold: MUSIC_LIST_VIRTUAL_THRESHOLD,
  forceVirtual: false
})

const emit = defineEmits<{
  (e: 'play', item: GetMusicDetailData, index: number): void
  (e: 'updateRuntimeList'): void
  (e: 'reachBottom'): void
}>()

// 固定行高，用于虚拟列表计算可视区域。
const ROW_HEIGHT = 70

// 页面跳转和全局状态依赖。
const router = useRouter()
const userStore = useUserStore()
const musicStore = useMusicStore()

// 搜索框和当前激活行的本地状态。
const searchKey = ref('')
const isFocus = ref(false)
const currentId = ref<number>(0)

// 用户喜欢集合和搜索关键字的派生状态。
const likeSet = computed(() => new Set(userStore.userLikeIds))
const searchKeyValue = computed(() => searchKey.value.trim().toLowerCase())

// 控制何时启用虚拟列表，避免小列表过度复杂化。
const virtualEnabled = computed(() => props.forceVirtual || props.list.length >= props.virtualThreshold)

// 给列配置补齐行内样式，模板里直接消费。
const normalizedColumns = computed(() => props.columns.map(col => ({
  ...col,
  _style: { ...col.style, width: col.width }
})))

// 统一补齐歌曲的展示字段。
const preparedList = computed(() => props.list.map(normalizeItem))

// 搜索后的最终展示列表。
const displayList = computed(() => {
  if (!searchKeyValue.value) return preparedList.value
  return preparedList.value.filter(item => item._searchText.includes(searchKeyValue.value))
})

// 数据被清空时，顺手清掉当前激活行。
watch(
  () => props.list.length,
  (length) => {
    if (!length) currentId.value = 0
  }
)

// 补齐展示字段和搜索字段，避免模板里反复计算。
function normalizeItem(item: GetMusicDetailData): MusicListItem {
  return {
    ...item,
    _duration: formattingTime(item.dt),
    _searchText: [
      item.name?.toLowerCase() || '',
      item.al?.name?.toLowerCase() || '',
      ...(item.ar?.map(artist => artist.name?.toLowerCase() || '') || [])
    ].join(' ')
  }
}

// 判断歌曲是否在用户喜欢列表里。
function isLike(item: GetMusicDetailData) {
  return likeSet.value.has(item.id)
}

// 双击播放：抽屉列表和普通歌单的运行列表更新规则不同。
function playHandler(item: GetMusicDetailData) {
  const index = preparedList.value.findIndex(song => song.id === item.id)

  if (props.type === 'drawerList') {
    if (musicStore.songs?.id === item.id) {
      return window.$audio.togglePlay()
    }
    emit('play', item, index)
    return
  }

  if (musicStore.currentItem?.id === musicStore.runtimeList?.id && musicStore.songs?.id === item.id) {
    return window.$audio.togglePlay()
  }

  emit('play', item, index)

  if (musicStore.runtimeList?.id !== musicStore.currentItem?.id) {
    emit('updateRuntimeList')
  }
}

// 跳转歌手详情，id 为 0 的占位歌手不跳转。
function goSinger(artist: GetMusicDetailData['ar'][number]) {
  if (!artist.id) return

  router.push({
    path: '/singerInfo',
    query: {
      id: artist.id
    }
  })
}

// 根据列表来源和歌曲状态生成右键菜单。
function getContextMenuList(type: 'playList' | 'drawerList', item: GetMusicDetailData): MenuItem[] {
  const menu: MenuItem[] = [
    {
      label: item.id === musicStore.songs?.id && musicStore.isPlay ? '暂停' : '播放',
      value: 'play'
    }
  ]

  if (item.id !== musicStore.songs?.id) {
    menu.push({
      label: '下一首播放',
      value: 'nextPlay'
    })
  }

  if (item.t === 0) {
    menu.push({
      label: '评论',
      value: 'comment'
    })
  }

  if (type === 'drawerList') {
    menu.push({
      label: '从播放列表删除',
      value: 'removePlayList'
    })
  }

  if (props.listInfo?.userId === userStore.userInfo?.account.id) {
    menu.push({
      label: '从歌单删除',
      value: 'removeMyList'
    })
  }

  return menu
}

// 处理右键菜单对播放队列的增删和插播。
function handleContextMenuSelect(menuItem: MenuItem, item: GetMusicDetailData) {
  if (!musicStore.runtimeList) {
    musicStore.runtimeList = { id: 0, tracks: [] }
  }

  const tracks = musicStore.runtimeList.tracks!
  const currentIndex = musicStore.currentIndex
  const index = tracks.findIndex(song => song.id === item.id)

  const insertNextToCurrent = () => {
    const insertIndex = currentIndex + 1
    tracks.splice(insertIndex, 0, item)
    return insertIndex
  }

  const removeFromList = (removeIndex: number) => {
    tracks.splice(removeIndex, 1)
    if (removeIndex < currentIndex) {
      musicStore.currentIndex--
    }
  }

  switch (menuItem.value) {
    case 'play':
      playFromContextMenu(item, index, currentIndex, tracks, removeFromList, insertNextToCurrent)
      break
    case 'pause':
      window.$audio.togglePlay()
      break
    case 'nextPlay':
      addToNextPlay(item, index, currentIndex, tracks, removeFromList, insertNextToCurrent)
      break
    case 'comment':
      break
    case 'removePlayList':
      removeRuntimeTrack(index, currentIndex, tracks)
      break
    case 'removeMyList':
      break
  }
}

// 从菜单点播放时，把目标歌曲插到当前歌曲后并立即播放。
function playFromContextMenu(
  item: GetMusicDetailData,
  index: number,
  currentIndex: number,
  tracks: GetMusicDetailData[],
  removeFromList: (removeIndex: number) => void,
  insertNextToCurrent: () => number
) {
  if (index === currentIndex) {
    window.$audio.togglePlay()
    return
  }

  if (index >= 0) {
    removeFromList(index)
  }

  const newIndex = tracks.length === 0
    ? tracks.push(item) - 1
    : insertNextToCurrent()

  musicStore.getMusicUrlHandler(item, newIndex)
}

// 只插播到下一首，不打断当前播放。
function addToNextPlay(
  item: GetMusicDetailData,
  index: number,
  currentIndex: number,
  tracks: GetMusicDetailData[],
  removeFromList: (removeIndex: number) => void,
  insertNextToCurrent: () => number
) {
  if (index === currentIndex + 1 && currentIndex !== -1) return

  if (index >= 0) {
    removeFromList(index)
  }

  if (tracks.length === 0) {
    tracks.push(item)
    musicStore.getMusicUrlHandler(item, 0)
    return
  }

  insertNextToCurrent()
}

// 从抽屉播放队列删除歌曲，并修正当前播放下标。
function removeRuntimeTrack(index: number, currentIndex: number, tracks: GetMusicDetailData[]) {
  if (index < 0) return

  tracks.splice(index, 1)

  if (tracks.length === 0) {
    musicStore.clearRuntimeList()
    return
  }

  if (index === currentIndex) {
    musicStore.cutSongHandler(true)
  } else if (index < currentIndex) {
    musicStore.currentIndex--
  }
}

// 虚拟列表滚到底时通知父组件继续分页。
function handleScrollEnd() {
  if (virtualEnabled.value) {
    emit('reachBottom')
  }
}
</script>

<style scoped lang="scss">
::v-deep(.iconfont.icon-xihuan1) {
  color: #ff6600;
}

.musicList {
  min-height: 0;
}

.search {
  display: flex;
  justify-content: flex-start;
  transition: all 0.3s ease;

  .el-input {
    width: 80px;
    transition: width 0.3s ease;

    &.active {
      width: 180px;
    }

    ::v-deep(.el-input__wrapper) {
      border-radius: 50px;
      transition: all 0.3s ease;
      border: none;

      &.is-focus {
        box-shadow: none;
      }
    }
  }
}

.list {
  min-height: 0;
}

.list-title {
  display: flex;
  font-size: 14px;
  height: 35px;
  color: $darkText;
  justify-content: space-around;

  .title-item {
    text-align: left;
  }

  .title-item.title {
    color: $darkText;
  }
}

.list-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
