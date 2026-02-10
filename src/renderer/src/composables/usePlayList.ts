import { getPlayListDetailApi, getSongDetailApi, getUserLikeListApi, getUserPlayListApi } from '@/api/musicLits'
import { useMusicStore, useUserStore } from '@/store/index'
import { reactive } from 'vue'
import { CurrentItem, GetMusicDetailData, PlayList } from '@/types/musicList'

interface PlayListStateType {
  listLoading: boolean,
  InfoLoading: boolean,
  playList: GetMusicDetailData[],
  ids: number[],
  listInfo: PlayList
}

export function usePlayList() {

  const musicStore = useMusicStore()
  const userStore = useUserStore()

  const playListState = reactive<PlayListStateType>({
    InfoLoading: false,
    listLoading: false,
    playList: [],
    ids: [],
    listInfo: {} as PlayList
  })

  // 获取歌单详情
  const getPlayListDetail = async (id: number) => {
    playListState.listLoading = true
    playListState.InfoLoading = true

    try {
      const res = await getPlayListDetailApi(id)
      playListState.listInfo = res.playlist
      playListState.InfoLoading = false
      const ids = res.playlist.trackIds?.map(item => item.id).join(',') || ''
      const { songs } = await getSongDetailApi(ids)
      musicStore.updateCurrentItem({ ...res.playlist, tracks: songs })
      playListState.playList = songs || []
      playListState.ids = songs?.map((item) => item.id)
      playListState.listLoading = false
    } finally {
      playListState.listLoading = false
      playListState.InfoLoading = false
    }
  }

  // 获取用户喜欢的音乐列表id
  const getUserLikeList = async () => {
    const uid = userStore.userInfo?.profile.userId as number
    const { ids } = await getUserLikeListApi(uid)
    userStore.setUserLikeIds(ids)
  }

  // 获取用户播放列表
  const getUserPlayList = async () => {
    const uid = userStore.userInfo?.profile.userId as number
    const res = await getUserPlayListApi(uid)
    return res
  }

  return {
    playListState,
    getPlayListDetail,
    getUserLikeList,
    getUserPlayList
  }
}
