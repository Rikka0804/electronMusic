<template>
  <div class="base-progress-bar w-full" v-if="props.songs?.ar">
    <el-slider v-model="model" :show-tooltip="false" />

  </div>
</template>

<script lang="ts" setup>
import { GetMusicDetailData } from '@/types/musicList'
import { useMusicStore } from '@/store'
import { computed } from 'vue'

interface Props {
  songs?: GetMusicDetailData
}

const props = defineProps<Props>()
const musicStore = useMusicStore()
const dt = computed<number>(() => {
  const val = musicStore.songs?.dt ?? 0
  return Number((val / 1000).toFixed(2))
})

const model = computed<number>({
  get() {
    return (musicStore.currentTime / dt.value) * 100
  },
  set(val) {
    window.$audio.time = (val * window.$audio?.el.duration) / 100
  }
})





</script>

<style scoped lang="scss">
.base-progress-bar {}

:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
}

:deep(.el-slider__button) {
  display: none;
}
:deep(.el-slider:hover) {
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
