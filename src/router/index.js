/**
 * 参考资料：https://router.vuejs.org/zh/
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    // 首页
    path: '/',
    name: 'myIndex',
    component: () => import('@/views/home/myIndex')
  },
  {
    // 新闻板块
    path: '/picTotext',
    name: 'picTotext',
    component: () => import('@/views/picTotext')
  },
  {
    // 新闻板块
    path: '/newsInfo',
    name: 'newsInfo',
    component: () => import('@/views/newsInfo')
  },
  {
    // 图书板块
    path: '/booksInfo',
    name: 'booksInfo',
    component: () => import('@/views/booksInfo')
  },
  {
    // 学习笔记总结
    path: '/studyNotes',
    name: 'studyNotes',
    component: () => import('@/views/studyNotes'),
    children: [
      {
        path: 'booksInfo2',
        name: 'booksInfo2',
        component: () => import('@/views/booksInfo')
      },
      {
        path: 'htmlBasic2',
        name: 'htmlBasic22',
        component: () => import('@/views/studyNotesFiles/htmlBasic')
      },
      {
        path: 'htmlBasic3',
        name: 'htmlBasic33',
        component: () => import('@/views/studyNotesFiles/htmlBasic')
      },
      {
        path: 'htmlBasic4',
        name: 'htmlBasic44',
        component: () => import('@/views/studyNotesFiles/htmlBasic')
      }

    ]

  }
]

const router = new Router({
  mode: 'history',

  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // // from 代表从哪个路径跳转过来
  // // next 是一个函数 表示放行
  // if (to.path === '/login') return next()
  // // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/')
  next()
})
export default router
