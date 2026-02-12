<template>
  <div class="musicList mt-[15px]" v-if="!loading && list.length > 0">
    <div class="search" v-if="needSearch">
      <el-input prefix-icon="Search" clearable placeholder="搜索" v-model="searchKey" @focus="isFocus = true"
        @blur="isFocus = false" :class="{ active: isFocus || searchKey }" />
    </div>
    <div class="list mt-[15px]">
      <div class="list-title " v-if="needTitle">
        <div v-for="config in normalizedColumns" v-show="!config.hidden" :key="config.title" class="title-item"
          :class="config.class" :style="config._style">
          {{ config.title }}
        </div>
      </div>
      <div class="list-container">
        <ContextMenu v-for="(value, index) in chunkList" :key="value.id" :items="getContextMenuList(props.type, value)"
          @select="(item) => handleContextMenuSelect(item, value)">
          <div class="musciList-item" @dblclick="playHandler(value)" @click="currentId = value.id"
            @contextmenu="currentId = value.id">
            <div class="item-container flex text-[14px] h-[70px] items-center justify-around"
              :class="{ 'active': currentId === value.id }">
              <div v-for="config in normalizedColumns" :key="config.type" :class="config.class" :style="config._style">
                <template v-if="config.type === 'index'">
                  {{ index + 1 }}
                </template>
                <template v-if="config.type === 'time'">
                  {{ value._duration }}
                </template>
                <template v-if="config.type === 'handle'">
                  <i v-for="val in config.icon" :key="val" class="iconfont cursor-pointer" :class="{
                    'icon-xihuan1': val === 'love' && isLike(value),
                    'icon-xihuan': val === 'love' && !isLike(value)
                  }" />
                </template>
                <template v-if="config.type === 'title'">
                  <div class="title-box  flex">
                    <el-image lazy style="width: 50px; height: 50px" :src="value.al.picUrl + '?param=150y150'"
                      class="title-img" />
                    <div class="title-info ml-[10px] flex flex-col justify-between flex-1">
                      <div class="title-name" :class="{ 'active': musicStore.songs?.id === value.id }">{{ value.name }}
                      </div>
                      <div class="title-artist" :class="{ 'active': musicStore.songs?.id === value.id }"> <span
                          v-for="(ar, index) in value.ar" :key="ar.id || index" :style="{
                            cursor: ar.id ? 'pointer' : 'default',

                          }">
                          {{ ar.name || '未知歌手' }}
                          <span v-if="index < value.ar.length - 1" style="color: #969696"> / </span>
                        </span></div>
                    </div>
                  </div>
                </template>
                <template v-if="config.type === 'album'">
                  <div class="album-name">{{ value.al.name || '未知专辑' }}</div>
                </template>
              </div>
            </div>
          </div>
        </ContextMenu>

      </div>

    </div>
  </div>
  <div v-else v-loading="props.loading" class="h-[80px]"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formattingTime } from '@/utils/utils'
import { type Columns } from '../musciList'
import { GetMusicDetailData, PlayList } from '@/types/musicList'
import { useUserStore } from '@/store'
import { useMusicStore } from '@/store'
import ContextMenu from '@/components/ContextMenu/index.vue'
interface Props {
  columns: Columns[],
  list: GetMusicDetailData[],
  listInfo?: PlayList,
  needSearch?: boolean,
  needTitle?: boolean,
  loading?: boolean,
  type?: 'playList' | 'drawerList' // 播放列表 或 抽屉列表
}
const props = withDefaults(defineProps<Props>(), {
  needSearch: true,
  needTitle: true,
  loading: false,
  type: 'playList'
})
interface Emits {
  (e: 'play', item: GetMusicDetailData, index: number): void
  (e: 'updateRuntimeList'): void
}
const emit = defineEmits<Emits>()
const searchKey = ref('')
const isFocus = ref(false)
const userStore = useUserStore()
const likeSet = computed(() => new Set(userStore.userLikeIds))
const isLike = (data: GetMusicDetailData) => likeSet.value.has(data.id)
const mylist = ref<GetMusicDetailData[]>([])

const chunkList = ref<GetMusicDetailData[]>([])
const chunkSize = 20
let rafId = 0
const renderChunked = (fullList: GetMusicDetailData[]) => {
  chunkList.value = []
  let start = 0
  cancelAnimationFrame(rafId)
  function appendChunk() {
    const next = fullList.slice(start, start + chunkSize)
    if (!next.length) return
    chunkList.value.push(...next)
    start += chunkSize
    rafId = requestAnimationFrame(appendChunk)
  }
  appendChunk()
}

watch(() => props.list, (val) => {


  mylist.value = val.map(item => ({
    ...item,
    _duration: formattingTime(item.dt),
    _searchText: [
      item.name?.toLowerCase() || '',
      item.al?.name?.toLowerCase() || '',
      ...(item.ar?.map(a => a.name?.toLowerCase() || '') || [])
    ].join(' ') //预处理搜索关键词
  }))
  renderChunked(mylist.value)
}, { immediate: true })

watch(() => searchKey.value, (val) => {
  const key = val.trim().toLowerCase()
  renderChunked(
    key ? mylist.value.filter(item => item._searchText?.includes(key)) : mylist.value
  )
}, { immediate: true })


const normalizedColumns = ref(
  props.columns.map(col => ({
    ...col,
    _style: { ...col.style, width: col.width }
  }))
)
const currentId = ref<number>(0)
// 双击击播放音乐
const musicStore = useMusicStore()
const playHandler = (item: GetMusicDetailData) => {
  const index = mylist.value.findIndex(i => i.id === item.id)
  // 区分播放列表和抽屉列表点击事件
  if (props.type === 'drawerList') {
    if (musicStore.songs?.id === item.id) {
      return window.$audio.togglePlay()
    }
    emit('play', item, index)

  } else {
    // 当前音乐列表是当前播放的音乐
    if (musicStore.currentItem?.id === musicStore.runtimeList?.id) {
      if (musicStore.songs?.id === item.id) {
        return window.$audio.togglePlay()
      }
    }
    emit('play', item, index)
    // 播放列表不是当前播放的音乐更新播放列表
    if (musicStore.runtimeList?.id !== musicStore.currentItem?.id) {
      emit('updateRuntimeList')
    }
  }


}

interface MenuItem {
  label: string
  value: string
}
//右键菜单按钮
const getContextMenuList = (type: 'playList' | 'drawerList', item: GetMusicDetailData): MenuItem[] => {
  const menu: MenuItem[] = []

  // 根据id判断是否是当前播放的音乐，根据播放状态判断是暂停还是播放，播放需特殊处理
  menu.push({
    label: item.id === musicStore.songs?.id && musicStore.isPlay ? '暂停' : '播放',
    value: 'play',
  })

  // 如果不是当前播放的音乐，添加下一首播放按钮
  if (item.id !== musicStore.songs?.id) {
    menu.push({
      label: '下一首播放',
      value: 'nextPlay'
    })
  }

  // 如果是一般类型音乐则有评论 0 普通 1 2 网盘音乐
  if (item.t == 0) {
    menu.push({
      label: '评论',
      value: 'comment'
    })
  }

  // 音乐侧边栏
  if (type === 'drawerList') {
    menu.push({
      label: '从播放列表删除',
      value: 'removePlayList'
    })
  }

  // 我的歌单
  if (props.listInfo?.userId === userStore.userInfo?.account.id) {
    menu.push({
      label: '从歌单删除',
      value: 'removeMyList'
    })
  }

  return menu
}
// 右键菜单点击事件
const handleContextMenuSelect = (item: MenuItem, value: GetMusicDetailData) => {



  switch (item.value) {
    case 'play':
      const tracks = musicStore.runtimeList?.tracks
      if (!tracks) return

      const index = tracks.findIndex(i => i.id === value.id)
      const currentIndex = musicStore.currentIndex
      if (index === currentIndex) {
        window.$audio.togglePlay()
      }
      else if (index >= 0) {
        if (index < currentIndex) {
          tracks.splice(index, 1)
          tracks.splice(currentIndex, 0, value)
          musicStore.getMusicUrlHandler(value)
        } else {
          tracks.splice(index, 1)
          tracks.splice(currentIndex + 1, 0, value)
          musicStore.getMusicUrlHandler(value, currentIndex + 1)
        }
      } else {
        tracks.splice(currentIndex + 1, 0, value)
        musicStore.getMusicUrlHandler(value, currentIndex + 1)
      }



      break
    case 'pause':
      window.$audio.togglePlay()
      break
    case 'nextPlay':

      break
    case 'comment':

      break
    case 'removePlayList':

      break
    case 'removeMyList':

      break
  }
}



</script>

<style scoped lang="scss">
::v-deep(.iconfont.icon-xihuan1) {
  color: #ff6600;
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
  .empty {
    //margin-left: 20px;
  }
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
  .musciList-item {
    .item-container {
      color: $darkText;
      border-radius: 10px;


      &.active {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      .title-box {
        width: 90%;

        .title-img {
          border-radius: 10px;
        }

        .title-info {
          .active {
            color: rgb(255, 60, 60) !important;
          }

          .title-name {
            @include textOverflow(1);
            font-size: 15px;
            font-weight: bold;

          }

          .title-artist {
            @include textOverflow(1);
            font-size: 13px;
            color: rgba(150, 150, 150, 0.60);
          }
        }

      }

      .album-name {
        width: 90%;
        @include textOverflow(1);
      }
    }
  }
}
</style>
