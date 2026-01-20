export type PlayList = Omit<GetPlayListDetailRes['playlist'], 'tracks'>

export interface GetUserPlayListRes {
  playlist: PlayList[]
  code: string
  more: boolean
  version: string
}

// specialType 注解
//   0	普通歌单
//   5	红心歌单
//   10	置顶歌单
//   20	尾部歌单
//   100	官方歌单
//   200	视频歌单
//   300	分享歌单
export interface GetPlayListDetailRes {
  code: 200
  playlist: {
    id: number // 歌单id
    name: string // 歌单名称
    coverImgUrl: string // 歌单封面图片
    userId: number // 创建歌单的用户id
    updateTime: number
    createTime: number // 创建时间
    description: string // 歌单描述
    specialType: 0 | 5 | 10 | 20 | 100 | 200 | 300
    playCount: number // 播放量
    trackCount: number //歌单下歌曲总数
    tags: Array<string>
    trackIds: {
      id: number
      uid: number
    }[]
    tracks: GetMusicDetailData[]
    creator: {
      // 创建这个歌单的用户信息
      nickname: string
      userId: number
      avatarUrl: string
      userType: number
      vipType: number
    }
    subscribed: boolean // 是否收藏
    ordered: boolean
    subscribedCount: number // 收藏总数
  }
}
// 用户当前选中的歌单列表，会随着用户选中的菜单变化
export type CurrentItem = GetPlayListDetailRes['playlist']

// 用户当前正在播放音乐的列表
export interface RuntimeList extends PlayList {
  tracks: GetMusicDetailData[] | { id: number }
}

// 歌曲详情
export interface GetMusicDetailData {
  al: {
    // 名称详情
    id: number
    name: string
    pic: number
    picUrl: string
  }
  ar: {
    // 歌手列表详情
    alias: [] // 别名列表
    id: number
    name: string
    tns: []
  }[]
  name: string
  dt: number
  id: number
  pop: number
  album: string
  _duration?: string
  _searchText?: string
}

export interface GetMusicDetailRes {
  code: number
  songs: GetMusicDetailData[]
}


export type getMusicUrlData = {
  size: number
  url: string
}
// 获取音乐url响应体
export interface GetMusicUrlRes {
  code: number
  data: getMusicUrlData[]
}

interface GetLyricRes {
  code: number
  klyric: {
    // 卡拉歌词(逐字)
    lyric: string // 可能会返回空串
    version: number
  }
  lrc: {
    // 逐行歌词
    lyric: string // 可能会返回空串
    version: number
  }
  yrc: {
    // 网易云逐字歌词
    lyric: string
  } | null
  tlyric: {
    // 翻译逐行歌词
    lyric: string // 可能会返回空串
    version: number
  } | null
}

export interface Lyric  { time: number | boolean; text: string; line?: number }
export interface Yrc  {
  time: number
  duration: number
  line?: number
  yrc: Array<{
    text: string
    transition: number
    cursor: number
    width?: number | string
  }>
}

// 获取智能推荐列表响应体
interface GetIntelliganceListRes {
  code: number
  message: string
  data: {
    id: number // 根对象ID
    alg: string // 算法
    recommended: boolean // 这个字段表示如果为false则表示当前歌曲是“已喜欢”列表里的，false则反之
    songInfo: GetMusicDetailData | null // 歌曲信息
  }[]
}


