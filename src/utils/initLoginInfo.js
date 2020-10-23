import router from '../router'
import store from '../store'
import { mineApi } from '../assets/api'
import MyUtils from './myUtils'
import MintUI from 'mint-ui'

const loginInfo = {
  getLoginType: function (paramsMap) {
    let loginType = 'next'
    let _default = paramsMap.get('default')
    let _showtype = paramsMap.get('showtype')
    let _role = paramsMap.get('role')
    let _loginName = paramsMap.get('loginName')
    let _code = paramsMap.get('code')
    if (_code) {
      loginType = 'wxlogin'
    } else if (_showtype) {
      loginType = 'workerLogin'
    } else if (_role && !_loginName) {
      loginType = 'wxPushNext'
    } else if (_role && _loginName) {
      // 从我要管家APP推送进入
      // 通过role更新对应的default
      loginType = 'workerPushLogin'
    } else if (_default) {
      loginType = 'wxNext'
      // 如果不存在token进行授权操作
      if (!MyUtils.getItem('token_user')) {
        loginType = 'wxAutho'
      }
    }
    return loginType
  },
  registerHandlerGoBack: function () {
    // 注册一个goback函数给原生调用，在用户点击android物理回退键时原生会调用goback函数，函数体由开发者自由编写
    window.TS_Common.registerHandler('goBack', () => {
      if (store.state.breadcrumbs.length > 1) {
        // 有路由先走路由返回
        router.go(-1)
      } else {
        // 最后，如果已经到根节点了，返回调用APP的返回，使得当前页面关闭
        window.TS_Common.nativeCall('goback')
      }
    })
  },
  // 跳转微信授权认证
  wxAutho: function () {
    let redirectUrl = window.location.href
    if (window.hcsConfig.environment === 'test') {
      redirectUrl = window.hcsConfig.authoURL + '?path=' + window.location.href
    }
    let locationUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      window.hcsConfig.appId + '&redirect_uri=' + encodeURIComponent((redirectUrl)) +
      '&response_type=code&scope=snsapi_base,snsapi_userinfo&state=1,0#wechat_redirect'
    window.location.href = locationUrl
  },
  // 从微信授权返回获得code后 进行登录
  wxLogin: async function (code) {
    let ret = true
    try {
      store.commit('setIniting', true)
      const Response = await mineApi.login(null, null, code, '2')
      if (Response.data.data.token) {
        console.log('token_user', Response.data.data.token)
        MyUtils.setItem('token_user', Response.data.data.token)
        // MyUtils.setItem('existTel',
        //   Response.data.data.telephone !== null && Response.data.data.telephone !== '')
        this.roleInit(Response.data.data.token.substring(0, 1))
        store.commit('setIniting', false)
      } else if (Response.data.errcode === '1007') {
        store.commit('setIniting', false)
      } else {
        console.log('登录失败:', Response)
        console.log('走到了:' + Response.data.errcode)
        alert('登录失败,' + Response.data.errmsg)
        ret = false
      }
    } catch (e) {
      if (e.data.errcode === '1007') {
        store.commit('setIniting', false)
      } else {
        console.log('登录失败:', e)
        console.log('走到了:' + e.data.errcode)
        alert('登录失败,' + e.data.errmsg)
        ret = false
      }
    }
    return ret
  },
  // 工作人员从我要管家app点击图标进入登录
  workerLogin: async function (data, successFunction) {
    try {
      store.commit('setIniting', true)
      const Response = await mineApi.login(data.tenantId, data.token)
      if (Response.data.data.token) {
        MyUtils.setItem('token_worker', Response.data.data.token)
        this.roleInit(Response.data.data.token.substring(0, 1))
        let toName = 'minehome'
        if (MyUtils.getItem('role') === '4') {
          toName = 'manageList'
          MyUtils.setItem('selectedCampusId', Response.data.data.selectedCampusId)
        } else if (MyUtils.getItem('role') === '5' || MyUtils.getItem('role') === '8') {
          toName = 'serviceTrack'
        } else if (MyUtils.getItem('role') === '3' || MyUtils.getItem('role') === '7') {
          toName = 'selectCampus'
        }
        store.commit('setIniting', false)
        successFunction(toName)
      }
    } catch (e) {
      if (e.data.errcode === '1007') {
        store.commit('setIniting', false)
      } else if (e.data.errcode !== '1007') {
        console.log('登录失败:', e)
        console.log('走到了:' + e.data.errcode)
        MintUI.MessageBox.alert('登录失败,' + e.data.errmsg).then(() => {
          window.TS_Common.nativeCall('goback')
        })
      }
    }
  },
  workerPushLogin: async function (data) {
    try {
      store.commit('setIniting', true)
      const Response = await mineApi.hlmsPushLogin(data.tenantId, data.loginName, data.selectedCampusId)
      if (Response.data.data.token) {
        MyUtils.setItem('token_worker', Response.data.data.token)
        this.roleInit(Response.data.data.token.substring(0, 1))
        // 主管进入无selectedCampus，导致相关查询无数据
        if (MyUtils.getItem('role') === '4') {
          MyUtils.setItem('selectedCampusId', Response.data.data.selectedCampusId)
        }
        store.commit('setIniting', false)
      }
    } catch (e) {
      if (e.data.errcode === '1007') {
        store.commit('setIniting', false)
      } else if (e.data.errcode !== '1007') {
        console.log('登录失败:', e)
        console.log('走到了:' + e.data.errcode)
        MintUI.MessageBox.alert('登录失败,' + e.data.errmsg).then(() => {
          window.TS_Common.nativeCall('goback')
        })
      }
    }
  },
  // 角色进行初始化
  roleInit (role) {
    store.commit('setIniting', true)
    MyUtils.setItem('role', role)
    MyUtils.setItem('default', role === '2' ? 'user' : 'worker')
  }
}

export { loginInfo }
