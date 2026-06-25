import {GetMusicDetailData} from '@/types/musicList'
// 搜索默认值
export interface getDefaultSearchRes {
  code: number
  data: {
    realkeyword: string // 真实关键字
    showKeyword: string // 显示关键字
  }
}
// 搜索所需字段
export interface searchObj {
  keywords: string,
  type: 1 | 100 | 1000, //1: 单曲, 100: 歌手, 1000: 歌单
  limit?: number,
  offset?: number,
}

// 搜索歌曲项
export interface searchSongItem {
  content: string
  iconUrl: string
  searchWord: string
}

// 热搜列表
export interface getHotSearchRes {
  data: searchSongItem[]
}


// 搜索匹配歌曲项
export interface searchSongAllMatchItem {
  alg: string
  keyword: string
  text?: string
}

// 搜索歌曲列表
export interface getSearchSongRes {
  result: {
    allMatch: searchSongAllMatchItem[]
  }
}

// 歌手项
export interface searchSingerItem {
  name: string
  id: number
  img1v1Url: string
  trans: string
}

// 搜索歌手返回结果
export interface searchSingerRes {
  result:{
    artistCount: number
    artists: searchSingerItem[]
  }

}


//歌手信息
export interface singerInfo {
  img1v1Url: string,
  alias: string[],
  followed: false,
  name: string,
  accountId: number,
  id:number,
  musicSize: number,
}

// 歌手详情返回
export interface singerDetail {
  artist:singerInfo,
  hotSongs:GetMusicDetailData[],
}

// 全部歌曲返回
export interface singerAllSong {
  songs:GetMusicDetailData[]
}


