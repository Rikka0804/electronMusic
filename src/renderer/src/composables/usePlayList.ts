import { getPlayListDetailApi, getSongDetailApi, getUserLikeListApi } from '@/api/musicLits'
import { useMusicStore, useUserStore } from '@/store/index'
import { reactive } from 'vue'
import { CurrentItem, GetMusicDetailData, PlayList } from '@/types/musicList'

interface PlayListStateType {
  loading: boolean
  playList: GetMusicDetailData[],
  ids: number[],
  listInfo: PlayList
}

export function usePlayList() {

  const musicStore = useMusicStore()
  const userStore = useUserStore()

  const playListState = reactive<PlayListStateType>({
    loading: false,
    playList: [],
    ids: [],
    listInfo: {} as PlayList
  })

  const getPlayListDetail = async (id: number) => {
    playListState.loading = true

    try {
      const res = await getPlayListDetailApi(id)
      const ids = res.playlist.trackIds.map(item => item.id).join(',')
      const { songs } = await getSongDetailApi(ids)
      musicStore.updateCurrentItem({ ...res.playlist, tracks: songs })
      playListState.playList = songs
      playListState.ids = songs.map((item) => item.id)
    } finally {
      playListState.loading = false
    }
  }

  const getUserLikeList = async () => {
    const uid = userStore.userInfo?.profile.userId as number
    const { ids } = await getUserLikeListApi(uid)
    userStore.setUserLikeIds(ids)
  }

  return {
    playListState,
    getPlayListDetail,
    getUserLikeList
  }
}
