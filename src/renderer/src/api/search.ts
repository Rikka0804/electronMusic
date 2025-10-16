import { request } from '@/utils/request'
import type { getDefaultSearchRes, getHotSearchRes, getSearchSongRes } from '@/types/search'

// 获取默认搜索关键词
export const getDefaultSearchApi = () =>
  request<getDefaultSearchRes>('/search/default', 'get')

// 获取热搜
export const getHotSearchApi = () =>
  request<getHotSearchRes>('/search/hot/detail', 'get')

// 获取搜索建议
export const getSearchSuggestApi = (keywords: string, type: 'mobile' | '' = '') =>
  request<getSearchSongRes>('/search/suggest', 'get', { keywords, type })
