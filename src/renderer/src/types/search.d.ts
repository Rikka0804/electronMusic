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
    artists: searchSingerItem[]
  }

}


