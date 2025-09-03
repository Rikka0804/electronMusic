import { request } from '@/utils/request'


export const searchSong = ( phone: string ) =>
  request('/captcha/sent', 'post',{phone})
