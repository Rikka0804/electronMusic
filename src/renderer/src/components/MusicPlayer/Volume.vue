<template>
  <div class="volume-box w-[150px] flex items-center">
    <i v-if="volume !== 0" class="iconfont icon-yinliang" @click="volumeHandler(true)" />
    <i v-else class="iconfont icon-jingyin" @click="volumeHandler(false)" />

    <el-slider v-model="model" :show-tooltip="false" @input="input" @change="change"
      style="width: 80px; overflow: hidden" />

    <div class="volume-value text-[12px] ml-[10px]">
      {{ model }}%
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/store'
import { userAudio } from '@/components/MusicPlayer/index.vue'

interface Props {
  audio?: userAudio
}

const props = defineProps<Props>()
const userStore = useUserStore()

/** slider 的百分比值 */
const model = ref(0)

/** 真实音量 0 ~ 1 */
const volume = computed(() => model.value / 100)

/** 统一设置音量的方法（核心） */
const setVolume = (v: number) => {
  if (!props.audio) return

  props.audio.volume = v
  userStore.volume = v
  localStorage.setItem('volume', String(v))
}

/** 初始化 / audio 就绪时同步音量 */
watch(
  () => props.audio,
  (audio) => {
    if (!audio) return

    const saved = Number(localStorage.getItem('volume'))
    const initVolume = Number.isNaN(saved) ? 1 : saved

    model.value = initVolume * 100
    audio.volume = initVolume
    userStore.volume = initVolume
  },
  { immediate: true }
)

// 静音前的音量（0 ~ 1）
const beforeVolume = ref(1)

const volumeHandler = (mute: boolean) => {

  if (mute && volume.value > 0) {
    beforeVolume.value = volume.value
  }

  const target = mute
    ? 0
    : beforeVolume.value || 1

  model.value = target * 100
  setVolume(target)
}


/** 拖动 slider */
const input = () => {
  setVolume(volume.value)
}

/** 松手后同步到 store（可选，其实 setVolume 已经做了） */
const change = () => {
  userStore.volume = volume.value
}
</script>


<style scoped lang="scss">
.volume-box {
  .icon-yinliang {
    font-size: 18px;
  }

  .iconfont {
    cursor: pointer;
    color: $text;
    margin-right: 8px;
  }

  .iconfont:hover {
    color: white;
  }
}

:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
}

:deep(.el-slider__button) {
  display: none;
}

:deep(.el-slider__bar) {
  background-color: rgb(236, 65, 65);
  height: 5px;
  border-radius: 3px;
}

:deep(.el-slider__runway) {
  height: 5px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
