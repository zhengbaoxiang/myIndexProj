import Vue from 'vue'
import router from './router/index'
import store from './store/index'

import style from './assets/style.css' // mint-ui/lib/style.css
// import MintUI from 'mint-ui'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入所有样式

import axios from 'axios'
import axiosUtils from './utils/axiosUtils'

import MyUtils from './utils/myUtils'
import gallery from 'img-vuer'

import App from './App.vue'
import components from './components/index'

import config from './config/index'
// 拿到全局配置项，存储在window对象下
window.myConfig = config

Vue.use(gallery, {
  useCloseButton: false // trigger gallery close with close button, default true
})

Vue.config.productionTip = false
Vue.prototype.eventHub = new Vue({})// 建立事件中心
// 图片加载出错时，默认展示图片
Vue.prototype._imageError = function (e) {
  e.target.src = require('@/assets/images/falling.jpg')
}
// Vue.use(MintUI) // 引入ui框架
Vue.use(ElementUi) // 引入ui框架
Vue.use(style) // 样式重置
Vue.use(components) // 注册自己的全局components

// axios进行初始化
axiosUtils.axiosInit()

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

// 把自定义的日期格式化函数绑到日期对象原先中
// eslint-disable-next-line no-extend-native
Date.prototype.Format = MyUtils.dateFormat
