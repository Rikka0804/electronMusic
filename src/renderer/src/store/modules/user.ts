import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {getUserAccountRes} from '@/types/user'

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

    const userLikeIds = ref<number[]>([])
    const setUserLikeIds = (val: number[]) => {
      userLikeIds.value = val
    }

    return { userInfo, setUser, cookie, setCookie , isLogin ,userLikeIds,setUserLikeIds}
  },
  {
    persist: true
  }
)
