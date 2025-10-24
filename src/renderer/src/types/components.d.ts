import Tabs from '@/components/Tabs/index.vue'

import Card from '@/components/Card/index.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Tabs: typeof Tabs;
    Card: typeof Card;
  }
}

export {}
