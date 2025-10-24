<template>
  <div class="userInfo mt-[15px]">
    <userCard :userInfo="userInfo" :loading="userLoading" />
    <userSongList :musicList="list" :uid="uid" :loading="loading" />
  </div>

</template>

<script lang="ts" setup>
import userCard from './components/userCard.vue';
import userSongList from './components/userSongList.vue';
import { getUserPlayList } from '@/api/musicLits'
import { getUserDetailApi } from '@/api/user'
import { PlayList } from '@/types/musicList'
import {Profile} from '@/types/user'
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store'
import { ref } from 'vue';

const route = useRoute()
const type = route.query.type
const userStore = useUserStore()
const uid = ref()
const list = ref<PlayList[]>([])
const loading = ref(false)
const userLoading = ref(false)
const userInfo = ref<Profile>()
const init = async () => {
  loading.value = true
  if (type === 'my') {
    uid.value = userStore.userInfo?.account.id
    userInfo.value = userStore.userInfo?.profile
  } else {
    userLoading.value = true
    uid.value = route.query.uid
    const res = await getUserDetailApi(uid.value)
    userInfo.value = res.profile
    userInfo.value.level = res.level
    userInfo.value.createDays = res.createDays
    userLoading.value = false
  }
  const res = await getUserPlayList(uid.value)
  loading.value = false
  list.value = res.playlist
}
init()





</script>

<style scoped lang="scss"></style>
