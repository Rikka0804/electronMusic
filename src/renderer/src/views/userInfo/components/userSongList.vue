<template>
  <div class="songList w-full p-[20px] rounded-[20px] mt-[20px]">
    <Tabs :list="list"></Tabs>

  </div>

</template>

<script setup lang="ts">
import { list } from '../config'

</script>

<style scoped lang="scss">
.songList {
  background-color: rgba(255, 255, 255, .05);
  box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.1);
  transition: 0.4s;
}


</style>
