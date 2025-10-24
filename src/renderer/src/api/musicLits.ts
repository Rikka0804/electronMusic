import { request } from '@/utils/request'
import { GetUserPlayListRes,GetPlayListDetailRes } from '@/types/musicList'

// 获取用户歌单信息
export const getUserPlayList = (uid: number) =>
  request<GetUserPlayListRes>('/user/playlist', 'get', { uid })


// 获取歌单详情
export const getPlayListDetailApi = (id: number) =>
  request<GetPlayListDetailRes>('/playlist/detail', 'get', { id })

