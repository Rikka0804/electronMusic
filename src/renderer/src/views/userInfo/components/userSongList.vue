<template>
  <div class="songList w-full p-[20px] rounded-[20px] mt-[20px]">
    <Tabs :list="list" v-model="currentList">
      <div class="listContent" v-loading="loading">
        <Card v-if="userStore.userInfo?.profile.userId === props.uid && currentList === 'createSongList' && !loading" :picUrl="img"
          name="我的听歌排行榜" />
        <Card v-for="item in playlist" :key="item.id" :picUrl="item.coverImgUrl" :name="item.name"
          :playCount="item.playCount" :trackCount="item.trackCount" @click="handleCardClick(item.id)" />
      </div>
    </Tabs>

  </div>

</template>

<script setup lang="ts">
import { list } from '../config'
import { PlayList } from '@/types/musicList'
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'
import img from '@/assets/img.jpg'

const userStore = useUserStore()
interface props {
  musicList: PlayList[],
  uid: number,
  loading: boolean

}
const props = defineProps<props>()

const currentList = ref(list[0].name)
const playlist = computed(() => {
  return props.musicList.filter(item => {
    if (currentList.value === 'createSongList') {
      return props.uid === userStore.userInfo?.profile.userId
        ? !item.subscribed
        : !item.ordered
    } else if (currentList.value === 'collectSongList') {
      return props.uid === userStore.userInfo?.profile.userId
        ? item.subscribed
        : item.ordered
    }
    return false
  })
})

const router = useRouter()
// 歌曲列表卡片点击
const handleCardClick = (id: number) => {
  router.push({
    path: '/playList',
    query: {
      id
    }
  })
}


</script>

<style scoped lang="scss">
.songList {
  background-color: rgba(255, 255, 255, .05);
  box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.1);
  transition: 0.4s;

  .listContent {
    padding-top: 15px;
    display: grid;
    //第一个属性：行与行间隔，第二个属性列与列间隔
    grid-gap: 20px 20px;
    //内容整体平均分布
    justify-content: space-between;
    //单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用auto-fill关键字表示自动填充
    grid-template-columns: repeat(auto-fill, calc(18vw - 20px));

    :deep(.el-loading-mask) {
      background: transparent;
    }
  }
}
</style>
