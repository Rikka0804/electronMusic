import axios, { Method } from 'axios'

const instance = axios.create({
  baseURL:'/api'
})

instance.interceptors.request.use(
  (config) => {
    // const store = useUserStore()
    // if (store.token && config.headers) {
    //   config.headers['Authorization'] = `${store.token}`
    // }
    // 生成当前时间戳（毫秒）
    const timestamp = Date.now()

    // 根据请求方法处理参数
    if (config.method?.toLowerCase() === 'get') {
      // GET请求：在params中添加timestamp
      config.params = {
        ...config.params,
        timestamp
      }
    } else {
      // 非GET请求：可以选择在data中添加，或保持在params中
      // 这里选择统一在params中添加，避免影响请求体
      config.params = {
        ...config.params,
        timestamp
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

type Data<T> = {
  code: string
  msg: string
  data: T
}
// 4. 请求工具函数
export const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  return instance.request<any, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
