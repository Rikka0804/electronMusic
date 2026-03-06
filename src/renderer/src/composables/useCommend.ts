import { useUserStore } from '@/store'
import { getRecommendSongsApi, getPersonalizedApi } from '@/api/musicLits'

import { ref } from 'vue'

export function useRecommend() {
  const userStore = useUserStore()
  const loading = ref<boolean>(true)

  // 判断是否需要重新获取推荐音乐
  const needRefresh = () => {

    const now = new Date()

    const today7 = new Date()
    today7.setHours(7, 0, 0, 0)

    return (
      userStore.recommendUpdateTime < today7.getTime() &&
      now.getTime() >= today7.getTime()
    )
  }

  const getRecommend = async () => {
    if (!needRefresh()) {
      return loading.value = false
    }
    const res = await getRecommendSongsApi()
    userStore.dailyRecommendPlayList = res.data.dailySongs
    const res1 = await getPersonalizedApi()
    userStore.recommendPlayList = res1.result
    userStore.recommendUpdateTime = Date.now()
    loading.value = false
  }
  return {
    getRecommend,
    loading
  }
}
