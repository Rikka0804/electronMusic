<template>
  <div class="singer-item w-[14vw] h-[20vw] rounded p-[15px] cursor-pointer flex flex-col items-center gap-[10px]">
    <div class="singer-pic w-[12vw] h-[12vw] rounded-[50%] overflow-hidden">
      <img :src="props.singer.img1v1Url" alt="" class="w-full h-full object-cover">
    </div>
    <div class="singer-name text-[16px] w-[12vw] text-center">
      {{ props.singer.name }}
    </div>

  </div>

</template>

<script setup lang="ts">
import type { searchSingerItem } from '@/types/search'
interface Props {
  singer: searchSingerItem
}


const props = defineProps<Props>()

</script>

<style scoped lang="scss">
.singer-item {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
  .singer-name {
    @include textOverflow(2);
  }
}

</style>
