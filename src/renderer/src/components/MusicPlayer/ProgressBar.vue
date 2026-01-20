<template>
  <div class="base-progress-bar w-full" v-if="props.songs?.ar">
    <el-slider
      :class="{ 'is-dragging': isSeeking }"
      v-model="slider"
      :show-tooltip="false"
      @mousedown="onStart"
      @mouseup="onEnd"
      @change="onEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { GetMusicDetailData } from '@/types/musicList'
import { useMusicStore } from '@/store'
import { computed, ref } from 'vue'

interface Props {
  songs?: GetMusicDetailData
}
const props = defineProps<Props>()
const musicStore = useMusicStore()

/** 是否正在拖动 */
const isSeeking = ref(false)
/** 拖动时的临时时间 */
const tempTime = ref(0)

/** 歌曲总时长（秒） */
const duration = computed(() => {
  return (musicStore.songs?.dt ?? 0) / 1000
})

/** slider 百分比 */
const slider = computed<number>({
  get() {
    const time = isSeeking.value
      ? tempTime.value
      : musicStore.currentTime

    return duration.value
      ? (time / duration.value) * 100
      : 0
  },
  set(val) {
    const time = (val * duration.value) / 100
    tempTime.value = time
  }
})

const onStart = () => {
  isSeeking.value = true
  tempTime.value = musicStore.currentTime
}

const onEnd = () => {
  if (!isSeeking.value) return
  isSeeking.value = false

  // ⭐ 松手才真正设置 audio
  window.$audio.time = tempTime.value
  musicStore.currentTime = tempTime.value
}
</script>


<style scoped lang="scss">
.base-progress-bar {}

:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
}

:deep(.el-slider__button) {
  display: none;
}
:deep(.el-slider:hover),
:deep(.el-slider.is-dragging) {
  .el-slider__runway {
    height: 5px;
  }

  .el-slider__bar {
    height: 5px;
  }
}
:deep(.el-slider__bar) {
  background-color: rgb(236, 65, 65);
  height: 2px;
  border-radius: 3px;

}

:deep(.el-slider__runway) {
  height: 2px;
  background-color: #d3d3d3;

}
</style>
