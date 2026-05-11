import { h } from 'vue'
export const MUSIC_LIST_VIRTUAL_THRESHOLD = 30


export interface Columns {
  title: string
  hidden?: boolean
  picUrl?: string
  icon?: string[]
  prop?: string
  on?: object
  style?: object
  width?: string
  type?: 'index' | 'handle' | 'title' | 'album' | 'time'
  class?: string
  processEl?: (createVNode: typeof h, arg: any, index: number) => any
}

export const columns: Columns[] = [
  {
    title: '#',
    width: '60px',
    type: 'index',
    class: 'empty',
    style: {
      position: 'relative',
      textAlign: 'center',

    }
  },
  {
    title: '标题',
    prop: 'name',
    picUrl: 'al.picUrl',
    width: '55%',
    class: 'title',
    type: 'title',
  },
  {
    title: '专辑',
    prop: 'al.name', // 嵌套取值
    width: '35%',
    class: 'album',
    type: 'album'
  },
  {
    title: '喜欢',
    width: '45px',
    type: 'handle',
    class: 'handle',
    icon: ['love']
  },
  {
    title: '时长',
    prop: 'dt',
    width: '10%',
    class: 'time',
    type: 'time',
  }
]

export const drawerColumns: Columns[] = [
  {
    title: '标题',
    prop: 'name',
    picUrl: 'al.picUrl',
    width: '80%',
    class: 'title',
    type: 'title',
    style: {
      marginLeft: '15px',

    }
  },
   {
    title: '喜欢',
    width: '45px',
    type: 'handle',
    class: 'handle',
    icon: ['love']
  },
  {
    title: '时长',
    prop: 'dt',
    width: '20%',
    class: 'time',
    type: 'time',
  }

]
