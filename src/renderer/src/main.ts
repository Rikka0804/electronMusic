import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
const app = createApp(App)

import { createApp } from 'vue'
import App from './App.vue'

// 路由
import router from './router'
app.use(router)

// store
import pinia from './store'
app.use(pinia)

// element-plus配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn,
})






// 全局组件
import InitComponent from '@/plugins/components'

app.use(InitComponent)

import "@/assets/main.scss"
app.mount('#app')
