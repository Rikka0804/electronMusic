import axios, { Method } from 'axios'

const instance = axios.create({
  baseURL: 'https://newmusicapi.rikka0804.top',
  timeout: 30000,
})

instance.interceptors.request.use(
  (config) => {
    // const store = useUserStore()
    // if (store.token && config.headers) {
    //   config.headers['Authorization'] = `${store.token}`
    // }
    // 生成当前时间戳（毫秒）
    const timestamp = Date.now()
    const cookie = `MUSIC_U=006F9F4ECA9D4BACE4B95CC291701BEF6E5CAA153D357BB03EDC2473C30D42A766CF16723F18BEDEBBDC97A805E500FA88FC8BC4B368C0CADFCDB9831F81A6CFF1CE127FA247AC5B842369E9456ED66A472F3AC74EA22E817804DD2E5682E871E959A36E5F707734561B3629612428A7AEB8F21F54B7EA99D5F78F61976AD0034D7B742698C135D58BE223278ED031BE5C65EDB192A63196D1511DC46335146F50CF3D2EB48FA41ED3569F31AD76D2E879D39411967618071C7F809CA5FDD3DAF601F2AC8FBC52E183954AAFB32D09467A4C05BE9930B4487F2CF8BC7952327F12D15C5F066E53CDC0214DC3C80806F5520A35EA4DF822CA54C5C47AD16893DF8E7FDB735C14EC40F90DC8866EC784CF8FF71CAD036AFB7A5726616B91FB9EEE7215202E17583A3D66D0C8C28AC3C25DDB3648C4DF92003D88B693F24D003410B0D3B4D1DA911C8CEAB5DB0C8022D48A8A9F3D318AA5DF93C543D255F098B7F41962443F92FB36A63494A2F7C89160F4E4DF883B4D5116581D05B494B1425C43CF3580CE0BC3A6395EB6D0FE20E6626202F48B6A0AB6EE5CAE45032220E5D92319; Max-Age=2147483647; Expires=Mon, 21 Sep 2093 13:30:01 GMT; Path=/; Domain=.music.163.com; HTTPOnly;`


    // 根据请求方法处理参数
    if (config.method?.toLowerCase() === 'get') {
      // GET请求：在params中添加timestamp
      config.params = {
        ...config.params,
        timestamp,
        cookie
      }
    } else {
      // 非GET请求：可以选择在data中添加，或保持在params中
      // 这里选择统一在params中添加，避免影响请求体
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
