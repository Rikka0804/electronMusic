import { reactive } from "vue"
import type { PlayList } from '@/types/musicList'
export const asideFontSize = 14
export const needUseComparisonPaths = ['/home', '/fm', '/video', '/follow', '/local', '/lately', '/cloud']
type AsideMenuListItem = {
  name: string
  path: string
  icon: string
  asideFontSize?: number
  id: number
} & Partial<PlayList>

interface AsideMenuGroup {
  title: string | false
  mark: string | false
  list: AsideMenuListItem[]
  type?: 'collapsed'
  isCollapsed?: boolean
  asideFontSize?: number
}

export const originAsideMenuConfig : AsideMenuGroup[]= [
  {
    title: false,
    mark: false,
    list: [
      {
        name: '为我推荐',
        icon: 'icon-home-fill',
        path: '/home',
        asideFontSize,
        id: 1,
      },
      // {
      //   name: '云音乐精选',
      //   icon: 'icon-headphone-fill',
      //   path: '/fm',
      //   asideFontSize,
      //   id: 2,
      // },

    ],
  },
  {
    title: false,
    mark: 'my',
    list: [
      // {
      //   name: '本地与下载',
      //   icon: 'icon-xiazaibendi',
      //   path: '/local',
      //   asideFontSize,
      //   id: 5,
      // },
      {
        name: '最近播放',
        icon: 'icon-zuijinlaifang',
        path: '/lately',
        asideFontSize,
        id: 6,
      },
      {
        name: '音乐云盘',
        icon: 'icon-headphone-fill',
        path: '/cloud',
        asideFontSize,
        id: 7
      }
    ],
  },
  {
    title: '创建的歌单',
    mark: 'myCreateList',
    type: 'collapsed',
    isCollapsed: true,
    list: [],
    asideFontSize,
  },
  {
    title: '收藏的歌单',
    mark: 'subscribedList',
    type: 'collapsed',
    isCollapsed: true,
    list: [],
    asideFontSize,
  },
]

export const asideMenuConfig = reactive([...originAsideMenuConfig])
