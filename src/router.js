/**
 * 参考资料：https://router.vuejs.org/zh/
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import MintUI from 'mint-ui'
import MyUtils from './utils/myUtils'

Vue.use(Router)

let route = new Router({
  mode: 'history',
  routes: [
    {
      // 首页
      path: '/index',
      name: 'pageContain',
      component: () => import('./views/pageContain')
    },
    {
      // 工单模块
      path: '/workorder',
      name: 'workorder',
      component: {
        template: `<div>
          <keep-alive key="keep-alive"><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
          <router-view v-if="!$route.meta.keepAlive" key="not-keep-alive"></router-view>
        </div>`
      },
      children: [
        {
          // 工单管理列表
          path: 'manageList',
          name: 'manageList',
          meta: { ishome: true, keepAlive: true },
          component: () => import('./views/workorder/manageList')
        }
      ]
    }
  ]
})

route.beforeEach((to, from, next) => {
  // 自动关闭组件弹窗
  // 初始化提交按钮状态
  MintUI.MessageBox.close()
  MintUI.Indicator.close()
  store.commit('setSubmit', true)

  // 运维管家&项目经理的选择院区判断
  if (
    (MyUtils.getItem('role') === '3' || MyUtils.getItem('role') === '7') &&
    !window.localStorage.getItem('selectedCampusId') &&
    to.path !== '/mine/selectCampus'
  ) {
    route.replace({ path: '/mine/selectCampus' })
  }
  // if (
  //   MyUtils.getItem('role') === '2' &&
  //   to.meta.requiresAuth &&
  //   MyUtils.getItem('existTel') === 'false'
  // ) {
  //   // 如果当前角色为普通用户且页面涉及手机号信息且未进行绑定手机操作时,跳转绑定页面
  //   route.push({ name: 'login', query: { redirect: to } })
  // } else {
  // 等待登录完毕后再进入页面
  let timer = function () {
    if (store.state.initing) {
      setTimeout(timer, 1000)
    } else {
      let _breadcrumbs = store.state.breadcrumbs // 全局存储的面包屑
      // 如果从selectCampus页面跳转 则清空breadcrumbs, 以to页面为第一个页面
      if (from.path === '/mine/selectCampus') {
        _breadcrumbs = []
      }
      if (to.path !== '/mine/selectCampus' && to.path !== from.path) {
        _breadcrumbs.push(to.path) // 加上next的路径
        _breadcrumbs = _breadcrumbs.slice(
          0,
          _breadcrumbs.findIndex((m) => m === to.path) + 1
        ) // 截取第一个to.path处的路径
        store.commit('setBreadcrumbs', _breadcrumbs) // ☆☆☆ 保存到全局对象
        console.log('from --> to', from.path + '-->' + to.path)
        console.log('from --> to', from, to)
        console.log('setBreadcrumbs', _breadcrumbs)
      }
      clearTimeout(timer)
      next()
    }
  }
  timer()
  // }
})

export default route
