import Vue from 'vue'
import { homeApi, wxApi } from '@/assets/api'
const getLocation = {
  getLocationAndTenant: async function (successFunction, needUrl) {
    // 首次进入,先获取城市
    let wx = require('weixin-js-sdk')
    const response = await wxApi.getSign(null)
    wx.config({
      debug: false,
      appId: window.hcsConfig.appId,
      timestamp: response.data.data.timestamp,
      nonceStr: response.data.data.noncestr,
      signature: response.data.data.sign,
      jsApiList: [
        'getLocation',
        'startRecord',
        'previewImage',
        'stopRecord',
        'translateVoice',
        'previewImage']
    })
    wx.ready(function () {
      wx.getLocation({
        success: function (res) {
          homeApi.getTenant(res.longitude, res.latitude).then((Response) => {
            successFunction(Response.data.data)
          })
        },
        fail: function (res) {
          if (Vue.$route.path === '/' || Vue.$route.path === '/product/home' ||
            Vue.$route.path === '/product/hospitals') {
            console.log(res)
            Vue.$Toast('定位失败,请开启GPS权限')
          }
        },
        complete: function (res) { }
      })
    })
  },
  getwxLocationAndTenant: function (successFunction) {
    let wx = require('weixin-js-sdk')
    wx.getLocation({
      success: function (res) {
        homeApi.getTenant(res.longitude, res.latitude).then((Response) => {
          successFunction(Response.data.data)
        })
      },
      fail: function (res) {
        if (Vue.$route.path === '/' || Vue.$route.path === '/product/home' ||
          Vue.$route.path === '/product/hospitals') {
          console.log(res)
          Vue.$Toast('定位失败,请开启GPS权限')
        }
      },
      complete: function (res) { }
    })
  },
  setLocalStorage: function (obj) {
    window.localStorage.setItem('city', obj.city)
    if (obj.id && obj.name) {
      window.localStorage.setItem('hospitalID', obj.id)
      window.localStorage.setItem('tenantName', obj.tenantName)
      window.localStorage.setItem('hospitalName', obj.name)
    } else {
      window.localStorage.removeItem('hospitalID')
      window.localStorage.removeItem('tenantName')
      window.localStorage.removeItem('hospitalName')
    }
  }
}
export default getLocation
