import { request } from '@/utils/request'
import { RecommendSongListRes } from '@/types/home'
// 获取每日推荐歌单
export const recommendSongList = () => request<RecommendSongListRes>('/recommend/resource', 'get')
