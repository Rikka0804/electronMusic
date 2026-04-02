<template>
  <div class="searchPage">
    <div class="pageTitle text-[24px] font-bold w-[80%] overflow-hidden whitespace-nowrap text-ellipsis mb-[10px]">
      {{ route.query.keywords }}
    </div>
    <div class="pageContent">
      <Tabs :list="list" v-model="currentList">

      </Tabs>

    </div>
  </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { list } from './config'
import { getSearchMusictApi, getSearchSingerApi, getSearchSongListApi } from '@/api/search'
const route = useRoute()
const currentList = ref(list[0].name)


</script>

<style scoped lang="scss"></style>
