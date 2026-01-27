<template>
  <div class="right w-[27%] flex items-center justify-between">
    <div class="timeBox flex text-[15px]">
      <div v-if="props.songs?.ar" class="current-time">{{ formattingTime(props.currentTime * 1000) }}</div>
      <span style="margin: 0 5px;line-height: 24px">/</span>
      <div v-if="props.songs?.ar" class="total-time">{{ formattingTime(props.songs.dt) }}</div>
    </div>
    <el-icon class="list cursor-pointer text-[20px]" @click="musicStore.drawerShow = !musicStore.drawerShow">
      <Expand />
    </el-icon>
    <Volume :audio="props.audio"></Volume>
  </div>

</template>

<script setup lang="ts">
import { formattingTime } from "@/utils/utils";
import { userAudio } from '@/components/MusicPlayer/index.vue'
import { GetMusicDetailData } from '@/types/musicList'
import { useMusicStore } from "@/store";
import Volume from "@/components/MusicPlayer/Volume.vue";

interface Props {
  currentTime: number,
  songs?: GetMusicDetailData,
  audio?: userAudio
}

const props = defineProps<Props>()
const musicStore = useMusicStore()


</script>

<style scoped lang="scss">
.timeBox {
  color: $text;

  .current-time,
  .total-time {}

  .list {}
}
</style>
