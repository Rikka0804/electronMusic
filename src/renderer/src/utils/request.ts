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
    const cookie = `MUSIC_U="MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/wapi/feedback;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/wapi/clientlog;;NMTID=00OUE4xI_sSeRVLvkS-ofn2GnUIZZQAAAGb1BpXCQ; Max-Age=315360000; Expires=Thu, 17 Jan 2036 02:34:14 GMT; Path=/;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/eapi/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/neapi/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/eapi/clientlog;;MUSIC_R_U=002D178F1F53BC4F22008DE2A861E4DB1C6555B1608597A99EC2A9C203E0ADD2157312A410C706CFB1390915693DA1430F887F8C458BD032A3DA4D01D3C3B20D4C95BED1EE5B7A480ADF435D49B7030401; Max-Age=15552000; Expires=Sat, 18 Jul 2026 02:34:14 GMT; Path=/eapi/login/token/refresh;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/openapi/clientlog;;MUSIC_SNS=; Max-Age=0; Expires=Mon, 19 Jan 2026 02:34:14 GMT; Path=/;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/eapi/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/weapi/feedback;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/api/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/api/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/api/feedback;;MUSIC_R_U=002D178F1F53BC4F22008DE2A861E4DB1C6555B1608597A99EC2A9C203E0ADD2157312A410C706CFB1390915693DA1430F887F8C458BD032A3DA4D01D3C3B20D4C95BED1EE5B7A480ADF435D49B7030401; Max-Age=15552000; Expires=Sat, 18 Jul 2026 02:34:14 GMT; Path=/api/login/token/refresh;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/wapi/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/api/clientlog;;MUSIC_U=00C96C7A97856FF676D153E11FBF71E68782FBE7EB40224CBE8CA7CCB4D48222365DB5793C5E05BC6A7A49939D5C0D2535A63EF09D82F40784794B2028A390ECDAB804708CF8D2B8EC9538E875FAF9FDE3B36FE47FAAE31C61552B81CA4530E055FCDF3C108467BA15841BEABF1218A95C18538C57ADF7D371142A91B5F8A001121D51BCABC29E3525D1D86BC0CA95AE4B3BA4C1C61EB7C07913281E2284822390AF4263C0F6BD792AAFD221309711FB6267040155749B2902E55C6AD42E83CB36EEC0286261D1E6501AD3401B5A5EA5E39BBD7CF262E99DAEB6B7609F627045210AF891ABC18376425A7288C8A7ACD61FEA682548C7C637AFA41C3367AA17D2565635202D5308CF91EC1322174574BE6C91737644D81ACECC754B9EC9AD5CBF26C8C90BFF6C0425FE63F0F2204C11FAB9F610FC5D83A9F7509EBC95356ADE599AB27174983C6FB6FE333D9F93649D905DA9BD0829DD01BFB1C2D0F2B3C535310AAC9DA82BB1A403A2C59FDC0EA7758D0B83C1715FC99D9CD52D0E167B66DF1505B3C431BDED70E797F007296B9F4A27E3; Max-Age=15552000; Expires=Sat, 18 Jul 2026 02:34:14 GMT; Path=/;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/weapi/feedback;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/eapi/clientlog;;__csrf=e1f1128e7797c4e5834b1fdc0042b504; Max-Age=1296010; Expires=Tue, 03 Feb 2026 02:34:24 GMT; Path=/;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1471415510091; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1471415470446; Max-Age=2147483647; Expires=Sat, 06 Feb 2094 05:48:21 GMT; Path=/neapi/feedback;"
; Max-Age=2147483647; Expires=Mon, 21 Sep 2093 13:30:01 GMT; Path=/; Domain=.music.163.com; HTTPOnly;`


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
