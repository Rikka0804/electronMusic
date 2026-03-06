

export const AppRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/userInfo',
        name: '用户信息',
        component: () => import('@/views/userInfo/index.vue')
      },
      {
        path: '/home',
        name: '为我推荐',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/fm',
        name: '云音乐精选',
        component: () => import('@/views/fm/index.vue')
      },
      {
        path: '/local',
        name: '本地与下载',
        component: () => import('@/views/local/index.vue')
      },
      {
        path: '/lately',
        name: '最近播放',
        component: () => import('@/views/lately/index.vue')
      },
      {
        path:'/cloud',
        name:'我的音乐云盘',
        component:()=>import('@/views/cloud/index.vue')
      },
      {
        path:'/playList',
        name:'歌单',
        component:()=>import('@/views/playList/index.vue')
      },
       {
        path:'/recommendPlayList',
        name:'推荐歌单',
        component:()=>import('@/views/home/recommendMusicList.vue')
      }

    ]
  }
]
