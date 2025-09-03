import { createRouter, createWebHashHistory } from 'vue-router'
import {AppRoutes} from './routes'
import {  beforeEach  , afterEach  } from './guards'


const router = createRouter({
  history: createWebHashHistory(),
  routes: AppRoutes,
})

//前置守卫
router.beforeEach(beforeEach)

//后置守卫
router.afterEach(afterEach)


export default router
