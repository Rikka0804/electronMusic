import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetMusicDetailData, CurrentItem, RuntimeList, Lyric, Yrc } from '@/types/musicList'
import { getLyricApi, getDynamicCoverApi, scrobbleApi, getMusicUrlApi } from '@/api/musicLits'
import { parseLrc, parseYrc } from '@lrc-player/parse'

export const useMusicStore = defineStore('my-music', () => {
  // 用户当前选中的歌单列表，会随着用户选中的菜单变化
  const currentItem = ref<CurrentItem | null>(null)
  const updateCurrentItem = (val: CurrentItem) => {
    val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
    currentItem.value = val
  }
  const clearCurrentItem = () => {
    currentItem.value = null
  }
  // 用户当前正在播放音乐的列表状态
  // 0心动 1列表循环 2随机播放 3单曲循环
  const orderStatusVal = ref<0 | 1 | 2 | 3>(1)

  // 当前播放歌曲的时间
  const currentTime = ref<number>(0)

  // 用户当前正在播放音乐的列表
  const runtimeList = ref<RuntimeList | null>(null)
  // 用户当前正在播放音乐的列表ids
  const runtimeIds = ref<number[]>([])
  const updateRuntimeList = (val: RuntimeList, ids: number[]) => {
    runtimeList.value = val
    runtimeIds.value = ids
  }
  const updateTracks = (tracks: GetMusicDetailData[], ids: number[]) => {
    if (runtimeList.value) {
      runtimeList.value.tracks = tracks
      runtimeIds.value = ids
    }
  }
  const clearRuntimeList = () => {
    runtimeList.value = null
  }

  // 当前用户正在播放的音乐
  const songs = ref<GetMusicDetailData>()

  const musicUrl = ref<string>('')
  // 获取音乐url并播放
  const getMusicUrlHandler = async (val: GetMusicDetailData, i: number) => {
    songs.value = val
    getLyric(val.id)
    getDynamicCover(val.id)
    scrobble(val.id, runtimeList.value?.id)

    const { data } = await getMusicUrlApi(val.id)
    musicUrl.value = data[0].url || ''
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
  // 更新听歌记录
  const scrobble = async (id: number, sourceid?: number) => {
    await scrobbleApi(id, sourceid)
  }

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
    currentTime
  }

},{persist: true})
