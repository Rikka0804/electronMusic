export interface Recommend {
  alg: string
  copywriter: ""
  createTime: number
  creator: {
    nickname: string
    userId: number
    avatarUrl: string
    userType: 4
    vipType: 11
  }
  id: number
  name: string
  picUrl: string
  playCount: number
  trackCount: number
  type: number
  userId: number
}
export type partialRecommend = Partial<Recommend>
export interface RecommendSongListRes {
  code: number
  featureFirst: boolean
  haveRcmdSongs: boolean
  recommend: Array<Recommend>
}
