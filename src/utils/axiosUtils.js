import axios from 'axios'
import MyUtils from './myUtils'
import { loginInfo } from './initLoginInfo'
import MintUI from 'mint-ui'
const axiosUtils = {
  axiosInit: () => {
    // 1.配置全局的接口调用IP，`baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    axios.defaults.baseURL = window.hcsConfig.axiosBaseURL

    // 2.添加响应拦截器
    axios.interceptors.response.use(function (response) {
      if (response.data.errcode === '0000' || response.data.errcode === '0') {
        return response
      } else if (response.data.errcode === '0004') {
        if (MyUtils.getItem('role') === '2') {
          console.log('axiosInit')
          loginInfo.wxAutho()
        } else {
          // 调用新接口就行工作人员的登录
          // loginInfo.workerPushLogin()
          MintUI.MessageBox.alert('登录信息失效,请重新进入！！').then(() => {
            window.TS_Common.nativeCall('goback')
          })
        }
      } else {
        return Promise.reject(response)
      }
    }, function (error) {
      // 对响应错误 reject
      return Promise.reject(error)
    })

    // 3.添加token放入header
    axios.interceptors.request.use(
      config => {
        let token = MyUtils.getItem('token_' + MyUtils.getItem('default'))
        if (token) { config.headers.token = token }
        return config
      },
      err => {
        return Promise.reject(err)
      }
    )
  },
  setInterceptors: () => {
  }
}
export default axiosUtils
