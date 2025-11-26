import { request } from '@/utils/request'
import { GetUserPlayListRes,GetPlayListDetailRes, GetMusicDetailRes } from '@/types/musicList'

// 获取用户歌单信息
export const getUserPlayList = (uid: number) =>
  request<GetUserPlayListRes>('/user/playlist', 'get', { uid })


// 获取歌单详情
export const getPlayListDetailApi = (id: number) =>
  request<GetPlayListDetailRes>('/playlist/detail', 'get', { id })

// 获取歌曲详情
export const getSongDetailApi = (ids: string) =>
  request<GetMusicDetailRes>('/song/detail', 'get', { ids })

// 获取用户喜欢音乐列表
export const getUserLikeListApi = (uid: number) =>
  request<{ checkPoint: number; code: number; ids: number[] }>('/likelist', 'get', { uid })
