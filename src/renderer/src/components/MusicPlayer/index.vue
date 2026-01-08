<template>
  <div class="bottom-container h-full flex items-center justify-between px-[15px]">
    <audio :src="props.src" ref="audio" class="plyr-audio" preload="auto" />
    <DetailLeft :songs="props.songs" />
    <DetaulCenter :orderStatus="orderStatus" :orderStatusVal="musicStore.orderStatusVal" :isPlay="isPlay"
      @setOrderHandler="setOrderHandler" />
    <DetailRight :currentTime="musicStore.currentTime" :songs="props.songs"/>
  </div>

</template>

<script setup lang="ts">
import { GetMusicDetailData } from '@/types/musicList'
import DetailLeft from './DetailLeft.vue'
import DetaulCenter from './DetaulCenter.vue'
import DetailRight from './DetailRight.vue'
import { useMusicStore } from '@/store'
import { usePlayList } from '@/composables/usePlayList';
import { ref ,UnwrapRef} from 'vue'

// 重写auido的暂停和播放
type userAudio = {
  play: (lengthen?: boolean) => Promise<undefined>
  pause: (isNeed?: boolean, lengthen?: boolean) => Promise<undefined>
} & Omit<HTMLAudioElement, 'pause' | 'play'>

// 自定义播放器的类型
export interface MusicPlayerInstanceType {
  el:UnwrapRef<userAudio>
}

interface Props {
  src: string,
  songs?: GetMusicDetailData
}
const isPlay = ref(false)
// 播放器实例
const audio = ref<userAudio>()
const props = defineProps<Props>()

const musicStore = useMusicStore()

const orderStatus = ['icon-xihuan5', 'icon-xunhuan', 'icon-suijibofang', 'icon-danquxunhuan']

const { playListState, getPlayListDetail } = usePlayList()
// 切换播放模式
const setOrderHandler = () => {
  const runtimeList = musicStore.runtimeList
  const newValue = (musicStore.orderStatusVal + 1) % orderStatus.length
  // 切换到非心动模式时，获取播放列表详情
  if (runtimeList?.specialType === 5 && musicStore.orderStatusVal === 0 && newValue !== 0) {
    getPlayListDetail(runtimeList.id)
    musicStore.updateTracks(
      playListState.playList,
      playListState.playList.map((item) => item.id)
    )
  }
  // 如果不是我喜欢的歌单则心动不可用
  musicStore.orderStatusVal =
    newValue === 0 && runtimeList?.specialType !== 5 ?
      1 : (newValue as typeof musicStore.orderStatusVal)
}



</script>

<style scoped lang="scss">
.bottom-container {
  backdrop-filter: blur(60px) saturate(210%);
}
</style>
