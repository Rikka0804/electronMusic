import { request } from '@/utils/request'

// 获取用户歌单信息
export const getUserPlayList = (uid: number) =>
  request('/user/playlist', 'get', { uid })
