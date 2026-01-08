import Tabs from '@/components/Tabs/index.vue'

import Card from '@/components/Card/index.vue'
import ContextMenu from '@/components/ContextMenu/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import MusicPlayer from '@/components/MusicPlayer/index.vue'


declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Tabs: typeof Tabs;
    Card: typeof Card;
    ContextMenu: typeof ContextMenu;
    SvgIcon: typeof SvgIcon;
    MusicPlayer: typeof MusicPlayer;
  }
}

export {}
