export type Profile = {
  avatarUrl: string // 用户头像
  backgroundUrl: string // 用户背景图片
  nickname: string // 用户昵称
  createTime: number
  vipType: number
  userId: number // 用户id
  followeds: number // 粉丝数量
  newFollows: number // 关注数量
  eventCount: number // 动态数量
  gender: number // 性别 0:保密 1:男性 2:女性
  province: number // 省份id
  city: number // 城市id
  signature: string // 用户签名
  level: number // 等级
  createDays: number // 创建天数
}
export type getUserAccountRes = {

  account: {
    anonimousUser: boolean // 是否匿名用户
    createTime: number
    vipType: number
    id: number // 用户id
  }
  code: number
  profile: Profile
}

export interface getUserDetailRes {
  code: number
  createDays: number
  createTime: number
  level: number // 等级
  profile: Profile
  userPoint: {
    balance: number
    blockBalance: number
    status: number
    updateTime: number
    userId: number
    version: number
  }
}
