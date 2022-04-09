import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入所有样式
import './assets/globalcss.css'
import './assets/globalless.less'

Vue.use(ElementUi) // 引入ui框架


window.myConfig = config

Vue.config.productionTip = false

window.EVENT_BUS = new Vue() // 建立事件中心
// Vue.prototype.eventHub = new Vue()// 建立事件中心

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
