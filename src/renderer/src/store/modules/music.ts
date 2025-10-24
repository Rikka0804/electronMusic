import { defineStore } from 'pinia'
import { ref } from 'vue'
import {GetPlayListDetailRes,CurrentItem} from '@/types/musicList'

export const useMusicStore = defineStore('my-music', () => {
  const currentItem = ref<GetPlayListDetailRes['playlist'] | null>(null)

  const updateCurrentItem = (val: CurrentItem) => {
    val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
    currentItem.value = val
  }
  return {
    currentItem,
    updateCurrentItem
  }

})
