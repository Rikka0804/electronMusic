import axios, { Method } from 'axios'
import { useUserStore } from '@/store'

const instance = axios.create({
  baseURL: 'https://newmusicapi.rikka0804.top',
  timeout: 30000,
})

instance.interceptors.request.use(
  (config) => {
    const timestamp = Date.now()

    // 从 pinia store 获取 cookie
    const userStore = useUserStore()
    const cookie = userStore.cookie

    // 根据请求方法处理参数
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        timestamp,
        cookie
      }
    } else {
      config.params = {
        ...config.params,
        timestamp,
        cookie
      }
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    return res.data
  },
  (err) => {
    // TODO 5. 处理401错误
    return Promise.reject(err)
  }
)

export default instance

export const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  // 直接将响应类型指定为 T
  return instance.request<any, T>({
    url,
    method,
    // 根据请求方法自动选择params或data
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
