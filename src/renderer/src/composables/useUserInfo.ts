import { usePlayList } from '@/composables/usePlayList';
import { useUserStore } from '@/store';
import { getUserInfoApi, getUserDetailApi } from '@/api/user'
import type { PlayList } from '@/types/musicList'
import { asideFontSize, asideMenuConfig } from '@/views/layout/components/asideConfig'
import { ElLoading } from 'element-plus'
import {ref} from 'vue'
export function useUserInfo() {
  let loading
  const isLoaidng = ref(true)
  const openFullScreenloading = () => {
    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(200, 200, 200, 0.4)'
    })
    isLoaidng.value = true
  }
  const closeFullScreenloading = () => {
    loading.close()
    isLoaidng.value = false
  }
  const userStore = useUserStore()
  const { getUserLikeList, getUserPlayList } = usePlayList()
  const getUserInfoFn = async () => {
    openFullScreenloading()
    const res = await getUserInfoApi()
    const { level, createDays } = await getUserDetailApi(res.account.id)
    res.profile.level = level
    res.profile.createDays = createDays

    userStore.setUser(res)
    await updatePlayList()

    await getUserLikeList()

  }
  const updatePlayList = async () => {
    if(!loading){
      openFullScreenloading()
    }
    const { playlist } = await getUserPlayList()
    const userId = userStore.userInfo?.account.id
    const likeList: PlayList[] = []
    const myCreateList: PlayList[] = []
    const subscribedList: PlayList[] = []

    playlist.forEach(item => {
      if (item.specialType === 5) {
        likeList.push(item)
      } else if (item.userId === userId) {
        myCreateList.push(item)
      } else {
        subscribedList.push(item)
      }
    })
    let newMenuConfig = JSON.parse(JSON.stringify(asideMenuConfig)) as typeof asideMenuConfig
    if (likeList.length > 0) {
      newMenuConfig.forEach(item => {
        if (item.mark === 'my') {
          item.list.unshift({
            name: '我喜欢的音乐',
            path: '/playList',
            icon: 'icon-aixin',
            asideFontSize,
            id: likeList[0].id,
          })
        }

      })
    }
    newMenuConfig.forEach(item => {
      if (item.mark === 'myCreateList') {
        item.list = myCreateList.map(i => ({
          ...i,
          name: i.name,
          path: '/playList',
          icon: '',
          asideFontSize,
          id: i.id,
        }))
      }
      if (item.mark === 'subscribedList') {
        item.list = subscribedList.map(i => ({
          ...i,
          name: i.name,
          path: '/playList',
          icon: '',
          asideFontSize,
          id: i.id,
        }))
      }
    })

    userStore.setAsideMenu(newMenuConfig)
    closeFullScreenloading()
     loading = null

  }
  return {
    getUserInfoFn,
    updatePlayList,
    isLoaidng,
  }

}
