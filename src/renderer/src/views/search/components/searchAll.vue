<template>
  <div class="all-page h-full overflow-y-auto">
    <searchItemContainer title="歌手" tab="singer" @click-title="emit('changeTab', $event)">
      <div class="flex gap-[20px]">
        <singerItem v-for="(item, index) in allState.singers" :key="index" :singer="item" ></singerItem>
      </div>
    </searchItemContainer>
    <searchItemContainer title="单曲" tab="music" @click-title="emit('changeTab', $event)">
      <MusicList :needSearch="false" :columns="columns" :list="allState.songs"
        @updateRuntimeList="handleUpdateRuntimeList" @play="handlePlay" />
    </searchItemContainer>
    <searchItemContainer title="歌单" tab="musicList" @click-title="emit('changeTab', $event)">
      <div class="card-list">
        <Card
          v-for="item in allState.songLists"
          :key="item.id"
          :picUrl="item.coverImgUrl"
          :name="item.name"
          :playCount="item.playCount"
          :trackCount="item.trackCount"
          @click="handleCardClick(item.id)"
        />
      </div>
    </searchItemContainer>
  </div>
</template>

<script setup lang="ts">
import singerItem from './singerItem.vue';
import searchItemContainer from './searchItemContainer.vue';
import type { PlayList, GetMusicDetailData } from '@/types/musicList'
import type { searchSingerItem } from '@/types/search'
import MusicList from '@/views/playList/components/MusicList.vue';
import { columns } from '@/views/playList/musciList'
import { useMusicStore } from '@/store';
import { useRouter } from 'vue-router';
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

const musicStore = useMusicStore()
const router = useRouter()

const handleUpdateRuntimeList = () => {

  musicStore.updateRuntimeList({ ...musicStore.currentItem });
  musicStore.orderStatusVal = 1
}
// 播放歌曲
const handlePlay = async (item, index) => {

  return await musicStore.getMusicUrlHandler(item, index)


}

const handleCardClick = (id: number) => {
  router.push({
    path: '/playList',
    query: {
      id
    }
  })
}
</script>

<style scoped lang="scss">
.card-list {
  --card-size: 200px;
  display: grid;
  grid-gap: 20px 0;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, var(--card-size));
}
</style>
