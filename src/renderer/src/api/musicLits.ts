import { request } from '@/utils/request'
import { GetUserPlayListRes, GetPlayListDetailRes, GetMusicDetailRes, GetMusicUrlRes, GetLyricRes ,GetIntelliganceListRes ,GetMusicDetailData} from '@/types/musicList'
import {Recommend} from "@/types/home"
// 获取用户歌单信息
export const getUserPlayListApi = (uid: number) =>
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

// 获取音乐url
export const getMusicUrlApi = (id: number) =>
  request<GetMusicUrlRes>(`/song/url/v1?id=${id}&level=lossless`, 'get')

// 获取歌词
export const getLyricApi = (id: number) =>
  request<GetLyricRes>(`/lyric/new`, 'get', { id })

// 获取动态封面
export const getDynamicCoverApi = (id: number) =>
  request<{ data: {videoPlayUrl: string} }>(`/song/dynamic/cover`, 'get', { id })

// 获取智能推荐列表
export const getIntelligenceListApi = (pid: number, id: number, sid: number) =>
  request<GetIntelliganceListRes>('/playmode/intelligence/list', 'get', { pid, id, sid })

// 获取每日推荐音乐
export const getRecommendSongsApi = () =>
  request<{data:{dailySongs:GetMusicDetailData[]}}>('/recommend/songs', 'get')


// 获取推荐歌单
export const getPersonalizedApi = () => request<{result:Recommend[]}>('/personalized', 'get')
