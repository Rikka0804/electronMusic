import { request } from '@/utils/request'
import type { getDefaultSearchRes, getHotSearchRes, getSearchSongRes, searchObj,searchSingerRes } from '@/types/search'
import type { GetMusicDetailData ,searchMusicListRes,searchMusicRes} from '@/types/musicList'
// 获取默认搜索关键词
export const getDefaultSearchApi = () =>
  request<getDefaultSearchRes>('/search/default', 'get')

// 获取热搜
export const getHotSearchApi = () =>
  request<getHotSearchRes>('/search/hot/detail', 'get')

// 获取搜索建议
export const getSearchSuggestApi = (keywords: string, type: 'mobile' | '' = '') =>
  request<getSearchSongRes>('/search/suggest', 'get', { keywords, type })

// 搜索单曲
export const getSearchMusictApi = (searchParams: searchObj) =>
  request<searchMusicRes>('/cloudsearch', 'get', searchParams)

// 搜索歌手
export const getSearchSingerApi = (searchParams: searchObj) =>
  request<searchSingerRes>('/cloudsearch', 'get', searchParams)

// 搜索歌单
export const getSearchSongListApi = (searchParams: searchObj) =>
  request<searchMusicListRes>('/cloudsearch', 'get', searchParams)
