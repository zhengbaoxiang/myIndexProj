/**
 * 参考资料：https://router.vuejs.org/zh/
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let route = new Router({
  mode: 'history',
  routes: [
    {
      // 首页
      path: '/',
      name: 'myIndex',
      component: () => import('./views/myIndex')
    }
  ]
})

route.beforeEach((to, from, next) => {
  // 路由导航守卫，使用next()，才能开始切换
  next()
  // console.log('from --> to', from.path + '-->' + to.path)
})

export default route
