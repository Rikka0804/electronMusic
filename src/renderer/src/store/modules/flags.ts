// store/modules/flags.ts
import { defineStore } from "pinia"
import { ref } from "vue"

export const useFlags = defineStore("flagsId", () => {
  const isMaximize = ref(false)      // 是否是最大化状态
  const isMinimize = ref(false)      // 是否是最小化状态
  const isOpenDetail = ref(false)    // 是否打开歌曲详情页面
  const isOpenSearch = ref(false)    // 搜索框是否被打开
  const count = ref(0)
  const isOpenDrawer = ref(false)    // 播放列表抽屉是否打开

  // 前进
  const forward = (val) => {
   count.value = val
  }



  return {
    isMaximize,
    isMinimize,
    isOpenDetail,
    isOpenSearch,

    count,
    isOpenDrawer,
    forward,

  }
}, {
  persist: false
})
