import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore(
  'my-user',
  () => {
    const user = ref(null)
    const setUser = (val) => {
      user.value = val
    }

    return { user, setUser }
  },
  {
    persist: true
  }
)
