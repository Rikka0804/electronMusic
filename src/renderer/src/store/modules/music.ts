import { defineStore } from 'pinia'
import { ref, nextTick, watch, toRaw } from 'vue'
import { GetMusicDetailData, CurrentItem, RuntimeList, Lyric, Yrc ,RuntimeListOptional } from '@/types/musicList'
import { getLyricApi, getDynamicCoverApi, getMusicUrlApi, getIntelligenceListApi } from '@/api/musicLits'
import { parseLrc, parseYrc } from '@lrc-player/parse'
import { randomNum } from '@/utils/utils'

export const useMusicStore = defineStore('my-music', () => {
  // 用户当前选中的歌单列表，会随着用户选中的菜单变化
  const currentItem = ref<RuntimeListOptional | null>(null)
  const updateCurrentItem = (val: CurrentItem) => {
    val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
    currentItem.value = val
  }
  const clearCurrentItem = () => {
    currentItem.value = null
  }

  // 播放状态
  const isPlay = ref(false)

  // 用户当前正在播放音乐的列表状态
  // 0心动 1列表循环 2随机播放 3单曲循环
  const orderStatusVal = ref<0 | 1 | 2 | 3>(1)

  // 当前播放歌曲的时间
  const currentTime = ref<number>(0)



  // 用户当前正在播放音乐的列表
  const runtimeList = ref<RuntimeListOptional | null>(null)
  // 用户当前正在播放音乐的列表ids
  const runtimeIds = ref<number[]>([])
  const updateRuntimeList = (val: RuntimeListOptional, ids: number[]) => {
    // 非心动列表 切换到列表循环模式
    if (val.specialType !== 5 && orderStatusVal.value === 0) {
      orderStatusVal.value = 1
    }
    runtimeList.value = {
      ...val,
      tracks: val.tracks!.map(track => ({
        ...toRaw(track)
      }))
    }

    runtimeIds.value = [...ids]
  }
  const updateTracks = (tracks: GetMusicDetailData[], ids: number[]) => {
    if (runtimeList.value) {
      runtimeList.value.tracks = tracks
      runtimeIds.value = ids
    }
  }
  // 清空当前正在播放的音乐列表
  const clearRuntimeList = async () => {
    runtimeList.value = null
    await window.$audio.pause(false)
    songs.value = undefined
    musicUrl.value = ''
  }

  // 当前用户正在播放的音乐
  const songs = ref<GetMusicDetailData>()

  const musicUrl = ref<string>('')
  // 当前用户正在播放的音乐索引
  const currentIndex = ref<number>(0)


  // 上一首歌曲索引列表 只记录随机播放
  const lastIndexList = ref<number[]>([])

  // 监听当前索引变化 记录随机播放的上一首歌曲索引
  watch(
    () => currentIndex.value,
    (value, oldValue) => {
      if (orderStatusVal.value !== 2) return
      if (oldValue === undefined) return

      lastIndexList.value.push(oldValue)
      // 只记录10条
      if (lastIndexList.value.length > 10) {
        lastIndexList.value.shift()
      }
    }
  )
  // 切回随机播放清除上一首歌曲索引列表
  watch(
    () => orderStatusVal.value,
    (mode, oldMode) => {
      if (mode === 2 && oldMode !== 2) {
        lastIndexList.value = []
      }
    }
  )
  // 获取音乐url并播放
  const getMusicUrlHandler = async (val: GetMusicDetailData, i?: number) => {
    getLyric(val.id)
    getDynamicCover(val.id)

    // 更新当前索引
    currentIndex.value = i ?? currentIndex.value

    const { data } = await getMusicUrlApi(val.id)
    songs.value = val

    window.$audio.reset()

    await window.$audio.pause(false)

    musicUrl.value = data[0].url.split('?')[0] || ''
    nextTick(() => {
      const el = window.$audio?.el
      if (!el) return

      el.oncanplay = () => {
        el.play()
      }
    })
  }
  // 获取心动歌曲列表  只支持我喜欢的列表 pid: 歌单id   id: 歌曲id
  const getintelligenceList = async () => {

    if (!runtimeList.value || !songs.value?.id) {
      return
    }
    const { data } = await getIntelligenceListApi(runtimeList.value.id!, songs.value?.id, songs.value?.id)

    const tracks = data
      .filter((item) => !!item.songInfo)
      .map((item) => {
        return item.songInfo!
      })
    tracks.unshift(songs.value)
    const ids = tracks.map((item) => {
      return item!.id
    })
    ids.unshift(songs.value.id)
    updateTracks(tracks, ids)

  }

  // 0心动 1列表循环 2随机播放 3单曲循环
  const orderTarget = (i: 0 | 1 | 2 | 3) => {
    if (i === 0) {
      return (currentIndex.value + 1) % runtimeIds.value.length
    } else if (i === 1) {
      return (currentIndex.value + 1) % runtimeIds.value.length
    } else if (i === 2) {
      return randomNum(0, runtimeIds.value.length - 1)
    } else {
      return currentIndex.value
    }
  }

  const playEnd = () => {
    currentIndex.value = orderTarget(orderStatusVal.value!)
    if (currentIndex.value > runtimeIds.value.length - 1) {
      return
    }
    getMusicUrlHandler(runtimeList.value!.tracks![currentIndex.value])
  }
  // 切换歌曲
  const cutSongHandler = (target: boolean) => {
    if ([0, 1, 3].includes(orderStatusVal.value!)) {
      currentIndex.value = target ? currentIndex.value + 1 : currentIndex.value - 1
      if (currentIndex.value > runtimeIds.value.length - 1) {
        currentIndex.value = 0
      } else if (currentIndex.value < 0) {
        currentIndex.value = runtimeIds.value.length - 1
      }
      getMusicUrlHandler(runtimeList.value!.tracks![currentIndex.value])
      return
    }
    if (!target) {
      const i =
        lastIndexList.value[lastIndexList.value.length - 1] || orderTarget(orderStatusVal.value)
      getMusicUrlHandler(runtimeList.value!.tracks![i])
      lastIndexList.value.splice(runtimeIds.value!.length - 1)
      return
    }
    playEnd()
  }
  // 初始化播放
  const initPlay = async (val?: number) => {
    // 切换到心动模式时，重置索引为0
    if (val === 0) {
      return currentIndex.value = 0
    }
    // 心动切其他时，重头播放该歌单
    await getMusicUrlHandler(runtimeList.value!.tracks![0], 0)
  }
  // 获取歌词
  const lrcMode = ref<0 | 1>(0) // 0 逐行 1 逐字
  const lrc = ref<Lyric[] & { notSupportedScroll?: boolean }>([])
  const yrc = ref<Yrc[] & { notSupportedScroll?: boolean }>([])
  const getLyric = async (id: number) => {
    const { lrc: lrcRes, yrc: yrcRes } = await getLyricApi(id)

    // 普通逐行歌词（.lrc）
    if (lrcRes?.lyric) {
      lrc.value = parseYrc(lrcRes.lyric)
    }

    // 逐字歌词（.yrc）
    if (yrcRes?.lyric) {
      yrc.value = parseLrc(yrcRes.lyric)
    }
  }
  // 获取动态封面
  const videoPlayUrl = ref<string>('')
  const getDynamicCover = async (id: number) => {
    const { data } = await getDynamicCoverApi(id)
    if (data.videoPlayUrl) {
      videoPlayUrl.value = data.videoPlayUrl
    } else {
      videoPlayUrl.value = ''
    }
  }



  //  音乐侧边栏是否显示
  const drawerShow = ref<boolean>(false)

  return {
    currentItem,
    clearCurrentItem,
    updateCurrentItem,
    runtimeList,
    runtimeIds,
    clearRuntimeList,
    updateRuntimeList,
    getMusicUrlHandler,
    songs,
    musicUrl,
    lrcMode,
    lrc,
    yrc,
    videoPlayUrl,
    orderStatusVal,
    updateTracks,
    currentTime,
    getintelligenceList,
    initPlay,
    playEnd,
    cutSongHandler,
    currentIndex,
    drawerShow,
    isPlay
  }

}, {
  persist: {
    omit: ['drawerShow']
  }

})
