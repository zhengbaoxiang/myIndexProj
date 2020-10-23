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
      path: '/',
      name: 'home',
      meta: { ishome: true },
      component: () => import('./views/product/home')
    },
    {
      // 登录模块
      path: '/login',
      name: 'login',
      component: () => import('./views/mine/register')
    },
    {
      // 个人中心模块
      path: '/mine',
      redirect: {
        name: 'minehome'
      },
      name: 'mine',
      component: {
        template: `<div>
          <keep-alive key="keep-alive"><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
          <router-view v-if="!$route.meta.keepAlive" key="not-keep-alive"></router-view>
        </div>`
      },
      children: [
        {
          path: 'home',
          name: 'minehome',
          meta: { ishome: true },
          component: () => import('./views/mine/home')
        },
        {
          path: 'issue',
          name: 'issue',
          component: () => import('./views/mine/issue')
        },
        {
          path: 'agreement',
          name: 'agreement',
          component: () => import('./views/mine/agreement')
        },

        {
          path: 'suggest',
          name: 'suggest',
          component: () => import('./views/mine/suggest')
        },
        {
          path: 'suggestList',
          name: 'suggestList',
          component: () => import('./views/mine/suggestList')
        },
        {
          path: 'satisfactionAppraise',
          name: 'satisfactionAppraise',
          component: () => import('./views/mine/satisfactionAppraise')
        },
        {
          path: 'dailyReport',
          name: 'dailyReport',
          component: () => import('./views/mine/dailyReport')
        },
        {
          path: 'call',
          name: 'call',
          component: () => import('./views/mine/call')
        },
        {
          path: 'selectCampus',
          name: 'selectCampus',
          component: () => import('./views/mine/selectCampus')
        },
        {
          path: 'dataStats',
          name: 'dataStats',
          component: () => import('./views/mine/dataStats')
        }
      ]
    },
    {
      // 产品模块，包括产品和护工的介绍和列表
      path: '/product',
      name: 'product',
      component: {
        template: `<div>
          <keep-alive key="keep-alive"><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
          <router-view v-if="!$route.meta.keepAlive" key="not-keep-alive"></router-view>
        </div>`
      },
      children: [
        {
          // 护工首页
          path: 'home',
          name: 'productHome',
          meta: { ishome: true },
          component: () => import('./views/product/home')
        },
        {
          // 护工首页-选择医院
          path: 'hospitals',
          name: 'selectHospital',
          component: () => import('./views/product/selectHospital')
        },
        {
          // 护工详情
          path: 'careworker/detail',
          name: 'careworkerDetail',
          component: () => import('./views/product/teamWorkerDetail')
        },
        {
          // 护工列表
          path: 'careworker/list',
          name: 'careworkerList',
          meta: { keepAlive: true },
          component: () => import('./views/product/teamWorkerList')
        },
        {
          // 套餐详情
          path: 'service/detail',
          name: 'serviceDetail',
          component: () => import('./views/product/serviceDetail')
        },
        {
          // 套餐列表
          path: 'service/list',
          name: 'serviceList',
          meta: { keepAlive: true },
          component: () => import('./views/product/serviceList')
        }
      ]
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
          // 服务跟踪
          path: 'serviceTrack',
          name: 'serviceTrack',
          meta: { ishome: true, keepAlive: true },
          component: () => import('./views/workorder/serviceTrack')
        },
        {
          // 服务工单详情
          path: 'serviceOrderDetail',
          name: 'serviceOrderDetail',
          component: () => import('./views/workorder/serviceDetail')
        },
        {
          // 服务工单对应的科室巡查页面
          path: 'departmentInspection',
          name: 'departmentInspection',
          component: () => import('./views/workorder/departmentInspection')
        },
        {
          // 派单
          path: 'sendOrder',
          name: 'sendOrder',
          component: () => import('./views/workorder/sendOrder')
        },
        {
          // 工单管理列表
          path: 'manageList',
          name: 'manageList',
          meta: { ishome: true, keepAlive: true },
          component: () => import('./views/workorder/manageList')
        },
        {
          // 工单详情
          path: 'manageDetail',
          name: 'manageDetail',
          component: () => import('./views/workorder/manageDetail')
        },
        {
          // 护理日志
          path: 'serviceLog',
          name: 'serviceLog',
          component: () => import('./views/workorder/serviceLog/serviceLog')
        },
        {
          // 服务项选择，护工可见
          path: 'serviceSelect',
          name: 'serviceSelect',
          component: () => import('./views/workorder/serviceSelect'),
          meta: { keepAlive: true }
        },
        {
          // 服务确认
          path: 'serviceConfirm',
          name: 'serviceConfirm',
          component: () => import('./views/workorder/serviceConfirm')
        },
        {
          // 绑铃
          path: 'bind',
          name: 'bind',
          component: () => import('./views/workorder/bind')
        }
      ]
    },
    {
      // 下单模块，包括订单确认，支付等
      path: '/order',
      redirect: {
        name: 'orderConfirm'
      },
      component: {
        template: `<div>
          <keep-alive key="keep-alive"><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
          <router-view v-if="!$route.meta.keepAlive" key="not-keep-alive"></router-view>
        </div>`
      },
      children: [
        {
          // 订单列表
          path: 'list',
          name: 'orderList',
          meta: { requiresAuth: true, keepAlive: true },
          component: () => import('./views/order/orderList')
        },
        {
          // 服务信息确认
          path: 'confirm',
          name: 'orderConfirm',
          // meta: { requiresAuth: true },
          component: () => import('./views/order/orderConfirm')
        },
        {
          // 代客下单
          path: 'valet',
          component: {
            template: `<router-view></router-view>`
          },
          children: [
            {
              // 创建新的代客下单
              path: 'create',
              name: 'valetCreate',
              // meta: { requiresAuth: true },
              component: () => import('./views/order/orderCreate')
            }
          ]
        },
        {
          // 下单成功后去支付
          path: 'pay',
          name: 'orderPay',
          // meta: { requiresAuth: true },
          component: () => import('./views/order/orderPay')
        },
        {
          // 订单详情
          path: 'detail',
          name: 'orderDetail',
          // meta: { requiresAuth: true },
          component: () => import('./views/order/orderDetail')
        },
        {
          // 退款申请
          path: 'refund',
          name: 'orderRefund',
          // meta: { requiresAuth: true },
          component: () => import('./views/order/orderRefund')
        }
      ]
    },
    {
      // 被护理人模块
      path: '/user',
      redirect: {
        name: 'userList'
      },
      component: {
        template: `<div>
          <keep-alive key="keep-alive"><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
          <router-view v-if="!$route.meta.keepAlive" key="not-keep-alive"></router-view>
        </div>`
      },
      children: [
        {
          // 成员列表
          path: 'list',
          name: 'userList',
          // meta: { requiresAuth: true },
          component: () => import('./views/user/list')
        },
        {
          // 成员详情
          path: 'detail',
          name: 'userDetail',
          // meta: { requiresAuth: true },
          component: () => import('./views/user/detail')
        }
      ]
    },
    {
      // 重定向模块
      path: '*',
      redirect: {
        name: 'home'
      }
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
