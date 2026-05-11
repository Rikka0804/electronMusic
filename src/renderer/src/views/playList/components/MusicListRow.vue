<template>
  <ContextMenu :items="menuItems" @select="handleSelect">
    <div
      class="musciList-item"
      @dblclick="emit('play', item)"
      @click="emit('activate', item.id)"
      @contextmenu="emit('activate', item.id)"
    >
      <div class="item-container flex h-[70px] items-center justify-around text-[14px]" :class="{ active: active }">
        <div v-for="config in columns" :key="config.type" :class="config.class" :style="config._style">
          <template v-if="config.type === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else-if="config.type === 'time'">
            {{ item._duration }}
          </template>
          <template v-else-if="config.type === 'handle'">
            <i
              v-for="icon in config.icon"
              :key="icon"
              class="iconfont cursor-pointer"
              :class="{
                'icon-xihuan1': icon === 'love' && isLike,
                'icon-xihuan': icon === 'love' && !isLike
              }"
            />
          </template>
          <template v-else-if="config.type === 'title'">
            <div class="title-box flex">
              <el-image
                lazy
                style="width: 50px; height: 50px"
                :src="item.al.picUrl + '?param=150y150'"
                class="title-img"
              />
              <div class="title-info ml-[10px] flex flex-col justify-between flex-1">
                <div class="title-name" :class="{ active: playing }">
                  {{ item.name }}
                </div>
                <div class="title-artist" :class="{ active: playing }">
                  <span
                    v-for="(artist, artistIndex) in item.ar"
                    :key="artist.id || artistIndex"
                    :style="{ cursor: artist.id ? 'pointer' : 'default' }"
                    @click.stop="emit('go-singer', artist)"
                  >
                    {{ artist.name || '未知歌手' }}
                    <span v-if="artistIndex < item.ar.length - 1" style="color: #969696"> / </span>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="config.type === 'album'">
            <div class="album-name">{{ item.al.name || '未知专辑' }}</div>
          </template>
        </div>
      </div>
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import ContextMenu from '@/components/ContextMenu/index.vue'
import type { Columns } from '../musciList'
import type { GetMusicDetailData } from '@/types/musicList'

type MusicListItem = GetMusicDetailData & {
  _duration: string
  _searchText: string
}

interface MenuItem {
  label: string
  value: string
}

interface Props {
  item: MusicListItem
  index: number
  columns: Array<Columns & { _style: CSSProperties }>
  active: boolean
  playing: boolean
  isLike: boolean
  menuItems: MenuItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'play', item: MusicListItem): void
  (e: 'activate', id: number): void
  (e: 'go-singer', artist: GetMusicDetailData['ar'][number]): void
  (e: 'menu-select', item: MenuItem, value: MusicListItem): void
}>()

// 转发右键菜单点击，保持父组件统一处理播放队列逻辑。
const handleSelect = (menuItem: MenuItem) => {
  emit('menu-select', menuItem, props.item)
}
</script>

<style scoped lang="scss">
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
          color: rgba(150, 150, 150, 0.6);
        }
      }
    }

    .album-name {
      width: 90%;
      @include textOverflow(1);
    }
  }
}
</style>
