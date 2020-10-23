import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import style from './assets/style.css' // mint-ui/lib/style.css
import components from './components/index'
import MyUtils from './utils/myUtils'
import axios from 'axios'
import axiosUtils from './utils/axiosUtils'
import { loginInfo } from './utils/initLoginInfo'
import Vconsole from 'vconsole'
import bridge from './assets/bridge'
import { Base64 } from 'js-base64'
import gallery from 'img-vuer'

Vue.use(gallery, {
  useCloseButton: false // trigger gallery close with close button, default true
})

window.TS_Common = bridge
// console.log(decodeURIComponent(window.location.href))

Vue.config.productionTip = false

Vue.use(MintUI) // 引入ui框架
Vue.use(style) // 样式重置
Vue.use(components) // 注册自己的components
Vue.prototype.getHomeName = function () {
  switch (MyUtils.getItem('role')) {
    case '2':
      return 'home'
    case '3':
      return 'selectCampus'
    case '4':
      return 'manageList'
    case '5':
      return 'serviceTrack'
    case '6':
      return 'minehome'
    case '7':
      return 'selectCampus'
    case '8':
      return 'serviceTrack'
    default:
      return 'minehome'
  }
}
Vue.prototype.goHistory = function () {
  if (store.state.breadcrumbs.length > 1) {
    // 有路由先走路由返回
    router.go(-1)
  } else if (MyUtils.getItem('default') === 'worker') {
    // 最后，如果已经到根节点了，返回调用APP的返回，使得当前页面关闭
    console.log('goHistoryworker')
    window.TS_Common.nativeCall('goback')
  } else if (MyUtils.getItem('default') === 'user') {
    // 用户到根节点后 返回首页
    console.log('goHistoryuser')
    router.replace({ name: 'home' })
  }
}

Vue.prototype.closePage = function () {
  console.log('closePage')
  window.TS_Common.nativeCall('goback')
}
// 当IOS键盘放下后调用此方法
Vue.prototype.restore = function () {
  if (MyUtils.isIOS()) {
    window.scroll(0, 0)
  }
}
// 建立事件中心
Vue.prototype.eventHub = new Vue({})

// 默认展示图片
Vue.prototype._imageError = function (e) {
  e.target.src = require('@/assets/imgs/noHead@2x.png')
}

// "http://tiansu-hcs.natapp1.cc/api/v1",
// 拿到全局配置项，存储在window对象下，window.hcsConfig
axios.get('/hcsConfig.json').then((response) => {
  window.hcsConfig = response.data
  // demo环境添加vconsole
  if (window.hcsConfig.vConsole) {
    let vConsole = new Vconsole()
    Vue.use(vConsole)
  }
  // axios进行初始化
  axiosUtils.axiosInit()
  store.commit('setIniting', true)
  // 根据url中的参数判断登录入口并进行跳转
  let paramsMap = new Map()
  var str = window.location.href // 取得整个地址栏
  var num = str.indexOf('?')
  str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]
  paramsMap = MyUtils.getParamsMap(str)
  if (paramsMap.get('params')) {
    str = Base64.decode(paramsMap.get('params'))
    window.location.href = window.location.href.substr(0, num + 1) + str
  }
  // let loginType = loginInfo.getLoginType(paramsMap)
  let _default = paramsMap.get('default')
  let _showtype = paramsMap.get('showtype')
  let _fromChrome = paramsMap.get('fromChrome')
  let _role = paramsMap.get('role')
  let _loginName = paramsMap.get('loginName')
  let _code = paramsMap.get('code')
  let _corpid = paramsMap.get('corpid')
  let _token = paramsMap.get('token')
  let _tenantId = paramsMap.get('tenantId')
  let _selectedCampusId = paramsMap.get('selectedCampusId')
  if (_code) {
    // 说明从微信授权返回项目 此时需要进行普通用户的登录
    // 登录获取用户token
    loginInfo.roleInit('2')
    loginInfo.wxLogin(_code)
  } else if (_showtype) {
    // 我要管家 首次进入
    if (!_fromChrome) {
      loginInfo.registerHandlerGoBack()
      window.TS_Common.nativeCall('loadSuccess')
    }
    loginInfo.workerLogin({
      token: _token,
      tenantId: _corpid
    }, ret => {
      let toName = ret
      console.log('toName', toName)
      router.push({ name: toName })
    })
  } else if (_role && !_loginName) {
    // 从微信推送进入
    // 通过role更新对应的default
    loginInfo.roleInit('2')
    store.commit('setIniting', false)
  } else if (_role && _loginName) {
    // 从我要管家APP推送进入
    // 通过role更新对应的default
    loginInfo.roleInit(_role)
    if (!_fromChrome) {
      loginInfo.registerHandlerGoBack()
      window.TS_Common.nativeCall('loadSuccess')
    }
    // 如果存在 selectedCampusId 说明是多院区角色从推送进入
    if (_selectedCampusId) {
      // 从推送进入 通过role更新对应的default
      window.localStorage.setItem('selectedCampusId', _selectedCampusId)
    }
    loginInfo.workerPushLogin({
      loginName: _loginName,
      tenantId: _tenantId,
      selectedCampusId: _selectedCampusId
    })
  } else if (_default) {
    // 为用户时,初始化用户角色
    console.log('defaultuser')
    loginInfo.roleInit('2')
    // 如果不存在token进行授权操作
    if (!MyUtils.getItem('token_user')) {
      console.log('_default')
      loginInfo.wxAutho()
    } else {
      store.commit('setIniting', false)
    }
  } else {
    if (MyUtils.getItem('default') === 'worker') {
      loginInfo.registerHandlerGoBack()
      window.TS_Common.nativeCall('loadSuccess')
    }
    store.commit('setIniting', false)
  }
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
})

// 添加实例方法
// 调用方式： this.$MessageBox.then(...)
Vue.prototype.$MessageBox = MintUI.MessageBox
Vue.prototype.$Toast = MintUI.Toast
Vue.prototype.$Indicator = MintUI.Indicator

// 添加全局的自定义的utils
// eslint-disable-next-line no-extend-native
Date.prototype.Format = MyUtils.dateFormat
