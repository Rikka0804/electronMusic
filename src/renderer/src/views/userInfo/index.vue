<template>
  <div class="userInfo mt-[15px]">
    <userCard />
    <userSongList />
  </div>

</template>

<script lang="ts" setup>
import userCard from './components/userCard.vue';
import userSongList from './components/userSongList.vue';
import { getUserPlayList } from '@/api/musicLits'
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store'
import { ref } from 'vue';

const route = useRoute()
const type = route.query.type
const userStore = useUserStore()
const uid = ref()
const init = async () => {
  if (type === 'my'){
    uid.value = userStore.userInfo?.account.id
  }
  const res = await getUserPlayList(uid.value)
  console.log(res);

}
init()





</script>

<style scoped lang="scss"></style>
