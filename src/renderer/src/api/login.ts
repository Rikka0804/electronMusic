import { request } from '@/utils/request'
// 获取二维码key
export const getQrKeyApi = () =>
  request<{ data: { unikey: string } }>('/login/qr/key', 'get')


interface getQrParams {
  key: string
  qrimg: boolean
}
interface getQrResult {
  data: {
    qrimg: string
    qrurl: string
  }

}
interface getCheckResult {

  code: number
  cookie: string
}
// 创建二维码
export const createQrApi = (params: getQrParams) =>
  request<getQrResult>('/login/qr/create', 'get', params)

// 轮询检查二维码状态
export const checkQrApi = (params: { key: string, noCookie: boolean }) =>
  request<getCheckResult>('/login/qr/check', 'get', params)


