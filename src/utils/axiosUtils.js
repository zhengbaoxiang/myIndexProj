import axios from 'axios'
const axiosUtils = {
  axiosInit: () => {
    // 1.配置全局的接口调用IP，`baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    axios.defaults.baseURL = window.hcsConfig.axiosBaseURL

    // 2.添加响应拦截器
    axios.interceptors.response.use(function (response) {
      if (response.data.errcode === '0000' || response.data.errcode === '0') {
        return response
      } else {
        return Promise.reject(response)
      }
    }, function (error) {
      // 对响应错误 reject
      return Promise.reject(error)
    })

    // 3.请求拦截器
    axios.interceptors.request.use(
      config => {
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
