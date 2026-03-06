<template>
  <div class="home">
    <div class="recommendList">
      <div class="recommendListContent">
        <AreaBox>
          <template #title>
            <div class=" font-bold text-[20px]">
              推荐歌单
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="image" />
              <div class="mt-[5px]">
                <el-skeleton-item variant="p" style="width: 50%" />
              </div>
            </template>
            <template #default>
              <Card :picUrl="dailyRecommendList?.[0]?.al?.picUrl" :name="'每日推荐'" @click="handleCardClick(0)" />
            </template>
          </el-skeleton>
          <el-skeleton v-for="(_, index) in (loading ? 10 : recommendList.length)" :key="index" :loading="loading"
            animated>
            <template #template>
              <el-skeleton-item variant="image" />
              <div class="mt-[5px]">
                <el-skeleton-item variant="p" style="width: 50%" />
              </div>
            </template>
            <template #default>
              <Card :picUrl="recommendList[index].picUrl" :name="recommendList[index].name"
                :playCount="recommendList[index].playCount" @click="handleCardClick(recommendList[index].id!)" />
            </template>
          </el-skeleton>
        </AreaBox>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import AreaBox from './components/areaBox.vue'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecommend } from '@/composables/useCommend'
import { useUserStore } from '@/store'


const userStore = useUserStore()

const recommendList = computed(() => {
  return userStore.recommendPlayList
})
const dailyRecommendList = computed(() => {
  return userStore.dailyRecommendPlayList
})
const { loading, getRecommend } = useRecommend()
onMounted(async () => {
  await getRecommend()
})


const router = useRouter()
const handleCardClick = (id: number) => {
  if (id === 0) {
    router.push({ path: '/recommendPlayList' })
  } else {
    router.push({
      path: '/playList',
      query: {
        id
      }
    })
  }
}

</script>

<style scoped lang="scss">
:deep(.el-skeleton) {
  width: calc(20vw - 20px);

  .el-skeleton__image {
    border-radius: 5px;
    width: calc(20vw - 20px);
    height: calc(20vw - 20px);
  }
}
</style>
