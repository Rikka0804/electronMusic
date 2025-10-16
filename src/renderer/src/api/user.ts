import { request } from '@/utils/request'
import type {getUserAccountRes} from '@/types/user'

// 获取账号信息
export const getUserInfoApi = () => request<getUserAccountRes>('/user/account', 'get')

// 获取用户详情
export const getUserDetailApi = (uid: number) =>
  request<{level:number ,createDays:number}>('/user/detail', 'get', { uid })
