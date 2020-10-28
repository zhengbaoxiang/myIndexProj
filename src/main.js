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
import gallery from 'img-vuer'

Vue.use(gallery, {
  useCloseButton: false // trigger gallery close with close button, default true
})

Vue.config.productionTip = false
Vue.prototype.eventHub = new Vue({})// 建立事件中心
// 图片加载出错时，默认展示图片
Vue.prototype._imageError = function (e) {
  e.target.src = require('@/assets/images/falling.jpg')
}
Vue.use(MintUI) // 引入ui框架
Vue.use(style) // 样式重置
Vue.use(components) // 注册自己的全局components

// 拿到全局配置项，存储在window对象下
axios.get('/myConfig.json').then((response) => {
  window.myConfig = response.data
  // axios进行初始化
  axiosUtils.axiosInit()

  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
})

// 把自定义的日期格式化函数绑到日期对象原先中
// eslint-disable-next-line no-extend-native
Date.prototype.Format = MyUtils.dateFormat
