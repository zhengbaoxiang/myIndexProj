
import { orderApi } from '@/assets/api'
import MintUI from 'mint-ui'
import store from '../store'

const orderPay = {
  // 去支付
  wxpay: async function (id, callbackFunction) {
    try {
      if (!store.state.submit) {
        return
      }
      MintUI.Indicator.open('正在为您计算支付信息...')
      // 锁定支付按钮
      store.commit('setSubmit', false)
      await orderApi
        .pay({ id: id })
        .then(response => {
          MintUI.Indicator.close()
          let wxParams = response.data.data
          wxParams.callbackFunction = callbackFunction
          console.log(response)
          wxPaySDK(wxParams)
        })
        .catch(e => {
          MintUI.Indicator.close()
          MintUI.MessageBox.alert(e.data.errmsg).then(() => {
            if (e.data.errcode === '4002' || e.data.errcode === '4020') {
              window.location.href = window.hcsConfig.domain + '/order/list?default=user'
            } else {
              callbackFunction()
            }
          })
        })
        .finally(() => {
          store.commit('setSubmit', true)
        })
    } catch (err) {
      MintUI.MessageBox.alert('下单失败，请稍后再试！')
    }
  },
  // 去支付
  appPay: async function (id, callbackFunction) {
    try {
      if (!store.state.submit) {
        return
      }
      MintUI.Indicator.open('正在为您计算支付信息...')
      // 锁定支付按钮
      store.commit('setSubmit', false)
      await orderApi
        .pay({ id: id })
        .then((response) => {
          MintUI.Indicator.close()
          let wxParams = response.data.data
          console.log(response)
          appPaySDK(wxParams, callbackFunction)
        })
        .catch((e) => {
          MintUI.Indicator.close()
          MintUI.MessageBox.alert(e.data.errmsg)
        })
        .finally(() => {
          store.commit('setSubmit', true)
        })
    } catch (err) {
      MintUI.MessageBox.alert('catch失败！')
    }
  }
}

export default orderPay

// 拉起支付页面
function onBridgeReady (params) {
  // let _this = this
  console.log('进入onBridgeReady')
  window.WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    params.h5_js,
    function (res) {
      console.log(res)
      store.commit('setSubmit', true)
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        console.log('支付成功')
        MintUI.Indicator.open('正在为您自动跳转...')
        setTimeout(() => {
          window.location.href =
            window.hcsConfig.domain + '/order/list?default=user'
          return 'ok'
        }, 1500)
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        console.log('支付取消')
        params.callbackFunction('cancel')
        return 'cancel'
      } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
        console.log('支付失败')
        return 'fail'
      }
    }
  )
}

function wxPaySDK (params) {
  // console.log('进入jsSDK')
  // console.log(params)
  if (typeof window.WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener(
        'WeixinJSBridgeReady',
        function () {
          onBridgeReady(params)
        },
        false
      )
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', function () {
        onBridgeReady(params)
      })
      document.attachEvent('onWeixinJSBridgeReady', function () {
        onBridgeReady(params)
      })
    }
  } else {
    onBridgeReady(params)
  }
}

function appPaySDK (params, callbackFunction) {
  console.log('进入我要管家APP支付', params.app_pay_data)
  window.TS_Common.nativeCall('wechatPay', {
    data: params.app_pay_data
  }, (result) => {
    console.log('进入我要管家APP支付返回结果', result)
    // 放开支付按钮
    callbackFunction(result)
    store.commit('setSubmit', true)
  })
}
