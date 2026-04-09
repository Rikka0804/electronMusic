<template>
  <div class="all-page h-full overflow-y-auto">
    <searchItemContainer title="歌手" tab="singer" @click-title="emit('changeTab', $event)">
      <div class="flex gap-[20px]">
        <singerItem v-for="(item, index) in allState.singers" :key="index" :singer="item"></singerItem>
      </div>
    </searchItemContainer>
    <searchItemContainer title="单曲" tab="music" @click-title="emit('changeTab', $event)">
       <!-- <MusicList  :needSearch="false" @play="handlePlay" /> -->  // TODO: 搜索结果的歌曲列表，点击播放时需要调用搜索接口获取歌曲详情接口获取歌曲url
    </searchItemContainer>
    <searchItemContainer title="歌单" tab="musicList" @click-title="emit('changeTab', $event)">
    </searchItemContainer>
  </div>
</template>

<script setup lang="ts">
import singerItem from './singerItem.vue';
import searchItemContainer from './searchItemContainer.vue';
import type { PlayList, GetMusicDetailData } from '@/types/musicList'
import type { searchSingerItem } from '@/types/search'
import MusicList from '@/views/playList/components/MusicList.vue';

interface Props {
  allState: {
    songs: GetMusicDetailData[],
    singers: searchSingerItem[],
    songLists: PlayList[]
  }
}

interface Emits {
  (e: 'changeTab', tab: 'music' | 'musicList' | 'singer'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
</style>
