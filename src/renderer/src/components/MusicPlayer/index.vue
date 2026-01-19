<template>
  <div class="bottom-container h-full flex items-center justify-between px-[15px] relative">
    <audio :src="props.src" ref="audio" class="plyr-audio" preload="auto" @timeupdate="timeupdate" />
    <DetailLeft :songs="props.songs" />
    <DetaulCenter :orderStatus="orderStatus" :orderStatusVal="musicStore.orderStatusVal" :isPlay="isPlay" @pause="pause"
      @play="play" @setOrderHandler="setOrderHandler" />
    <DetailRight :currentTime="musicStore.currentTime" :songs="props.songs" :audio="audio" />
  </div>
  <div class="plan-container absolute w-full flex items-center h-[15px] top-[-8.5px]">
    <ProgressBar :songs="props.songs" />
  </div>

</template>

<script setup lang="ts">
import { GetMusicDetailData } from '@/types/musicList'
import DetailLeft from './DetailLeft.vue'
import DetaulCenter from './DetaulCenter.vue'
import DetailRight from './DetailRight.vue'
import ProgressBar from './ProgressBar.vue'
import { useMusicStore, useUserStore } from '@/store'
import { usePlayList } from '@/composables/usePlayList';
import { ref, UnwrapRef, onMounted, reactive } from 'vue'



// 重写auido的暂停和播放
export type userAudio = {
  play: (lengthen?: boolean) => void;
  pause: (isNeed?: boolean, lengthen?: boolean) => void;
} & Omit<HTMLAudioElement, 'pause' | 'play'>

// 自定义播放器的类型
export interface MusicPlayerInstanceType {
  el: UnwrapRef<userAudio>
  isPlay: UnwrapRef<boolean>
  pause: typeof pause
  play: typeof play
  time: number
}

interface Props {
  src: string,
  songs?: GetMusicDetailData
}
const props = defineProps<Props>()
// 播放状态
const isPlay = ref(false)
// 播放器实例
const audio = ref<userAudio>()
// 播放器原始播放和暂停
let originPlay: HTMLMediaElement['play']
let originPause: HTMLMediaElement['pause']

onMounted(() => {
  originPlay = audio.value!.play as HTMLMediaElement['play']
  originPause = audio.value!.pause as HTMLMediaElement['pause']
  audio.value!.play = play
  audio.value!.pause = pause

})
const userStore = useUserStore()
const musicStore = useMusicStore()
const play = (lengthen: boolean = false) => {


  originPlay.call(audio.value).catch((err) => {
    console.error('调用origin.play方法时抛出了错误：', err)
  })
  isPlay.value = true
}
const pause = (isNeed: boolean = true, lengthen: boolean = false) => {
  originPause.call(audio.value)
  isPlay.value = false
}




const timeState = reactive({
  stop: false,
  previousTime: 0 // 新增属性来保存旧的 currentTime
})

const timeupdate = () => {
  if (timeState.stop || isNaN(window.$audio.el.duration)) { return }
  // 在更新 currentTime 之前，保存旧的值
  timeState.previousTime = musicStore.currentTime
  musicStore.currentTime = window.$audio.time
}
onMounted(() => {
  const el = audio.value!

  el.addEventListener('loadedmetadata', () => {
    if (
      musicStore.currentTime > 0 &&
      musicStore.currentTime < el.duration
    ) {
      el.currentTime = musicStore.currentTime
    }
  })
})

// 循环播放模式
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

const exposeObj = {
  el: audio,
  isPlay,
  play,
  pause,

}
Object.defineProperty(exposeObj, 'time', {
  get(): number {
    return audio.value!.currentTime
  },
  set(time: number) {
    try {
      audio.value!.currentTime = time
    } catch (e) {
      console.error('设置time时出现了错误: ', e, ',time: ', time)
    }
  }
})
defineExpose(exposeObj)


</script>

<style scoped lang="scss">
.bottom-container {
  backdrop-filter: blur(60px) saturate(210%);
}

.plan-container {}
</style>
