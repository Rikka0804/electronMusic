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
export type CurrentItem = Omit<GetPlayListDetailRes['playlist']>

export type GetMusicDetailData = {
  al: {
    // 名称详情
    id: number
    name: number
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
}
