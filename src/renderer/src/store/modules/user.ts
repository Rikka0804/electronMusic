import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { getUserAccountRes } from '@/types/user'
import { GetUserPlayListRes, GetMusicDetailData } from '@/types/musicList'
import { asideMenuConfig } from '@/views/layout/components/asideConfig'
import { Recommend } from '@/types/home'
export const useUserStore = defineStore(
  'my-user',
  () => {
    const cookie = ref<string>('')
    const isLogin = ref<boolean>(false)
    const setCookie = (val: string) => {
      cookie.value = val
    }
    const userInfo = ref<getUserAccountRes>()
    const setUser = (val: getUserAccountRes) => {
      isLogin.value = true
      userInfo.value = val
    }

    // 喜欢的音乐id
    const userLikeIds = ref<number[]>([])
    const setUserLikeIds = (val: number[]) => {
      userLikeIds.value = val
    }

    // 我的歌单
    const userPlayList = ref<GetUserPlayListRes>()
    const setUserPlayList = (val: GetUserPlayListRes) => {
      userPlayList.value = val
    }

    //当前播放器的音量
    const volume = ref<number>(0.5)

    //侧边栏
    const asideMenu = ref([...asideMenuConfig])
    const setAsideMenu = (val: typeof asideMenuConfig) => {
      asideMenu.value = val
    }

    // 推荐歌单
    const recommendPlayList = ref<Recommend[]>([])

    // 每日推荐歌单
    const dailyRecommendPlayList = ref<GetMusicDetailData[]>([])

    // 推荐更新时间
    const recommendUpdateTime = ref<number>(0)





    return { userInfo, setUser, cookie, setCookie, isLogin, userLikeIds, setUserLikeIds, volume, userPlayList, setUserPlayList, asideMenu, setAsideMenu, recommendPlayList, dailyRecommendPlayList, recommendUpdateTime }
  },
  {
    persist: true
  }
)
