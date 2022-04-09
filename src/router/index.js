/**
 * 参考资料：https://router.vuejs.org/zh/
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import config from '@/config'

Vue.use(Router)

const router = new Router({
    routes,
    mode: 'history',
    base: config.publicPath
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // // from 代表从哪个路径跳转过来
  // // next 是一个函数 表示放行
  next()
})
export default router
