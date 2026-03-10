<template>
<div class="searchPage">
  <div class="pageTitle text-[24px] font-bold w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
    {{ route.query.keywords }}
  </div>
</div>

</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
const route = useRoute()
console.log(1111);


</script>

<style scoped lang="scss">

</style>
