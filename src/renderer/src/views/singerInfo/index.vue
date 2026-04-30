<template>
  <div class="singerInfo">
    {{ `id: ${route.query.id}` }}
  </div>

</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router';
import { getSingerDescApi, getSingerInfoApi, getSingerSongApi } from '@/api/search'

const route = useRoute()

const getSingerIfno = async () => {
  if (!route.query.id) return
  const id = Number(route.query.id)
  await Promise.all([
    getSingerInfoApi(id),
    getSingerSongApi(id),
    getSingerDescApi(id)
  ])
}

watch(
  () => route.query.id,
  () => {
    getSingerIfno()
  },
  {
    immediate: true
  }
)

</script>

<style scoped lang="scss"></style>
