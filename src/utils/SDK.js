import { wxApi } from '@/assets/api'
import wx from 'weixin-js-sdk'
import MintUI from 'mint-ui'
import MyUtils from '@/utils/myUtils'

const SDK = {
  // 获取微信jssdk的配置参数 待优化 主要是扫码
  getWXConfig: async function (cfg) {
    try {
      const response = await wxApi.getSign()
      wx.config({
        debug: false,
        appId: window.hcsConfig.appId,
        timestamp: response.data.data.timestamp,
        nonceStr: response.data.data.noncestr,
        signature: response.data.data.sign,
        jsApiList: [
          'previewImage',
          'startRecord',
          'stopRecord',
          'translateVoice',
          'chooseImage',
          'uploadImage',
          'getLocalImgData'
        ]
      })
      return true
    } catch (error) {
      return false
    }
  },

  // 以下为微信sdk的接口
  // chooseImage: function (options, callback) {
  //   wx.chooseImage({
  //     count: options.count, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
  //       callback(localIds)
  //     }
  //   })
  // },
  // uploadImage: function (localId, callback) {
  //   wx.uploadImage({
  //     localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
  //     isShowProgressTips: 1, // 默认为1，显示进度提示
  //     success: function (res) {
  //       var serverId = res.serverId // 返回图片的服务器端ID
  //       callback(res)
  //     }
  //   })
  // },
  // getLocalImgData: function (localId, callback) {
  //   wx.getLocalImgData({
  //     localId: localId, // 图片的localID
  //     success: function (res) {
  //       var localData = res.localData // localData是图片的base64数据，可以用img标签显示
  //       callback(res)
  //     }
  //   })
  // },

  // 图片预览功能
  previewImage: function (url, list) {
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  // 语音翻译功能
  translateVoice: function (localId, successFunction) {
    wx.translateVoice({
      localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        // 更新页面展示状态
        // 语音识别的结果
        successFunction(res.translateResult || '')
      }
    })
  },
  recordStart: function () {
    if (isNativeCall()) {
      window.TS_Common.nativeCall('speechRecognitionStart', {})
    } else {
      wx.startRecord()
    }
  },
  recordEnd: function (startTime, successFunction) {
    if (isNativeCall()) {
      window.TS_Common.nativeCall('speechRecognitionEnd', {}, (result) => {
        let endTime = new Date().getTime()
        // 判断若说话时间短于200ms则要求重新录音
        if (endTime - startTime < 1000) {
          MintUI.Toast({
            message: '说话时间太短!',
            duration: 2000
          })
          return
        }
        successFunction(result)
      })
    } else {
      wx.stopRecord({
        success: function (res) {
          // 记录结束时间
          console.log('res', res)
          let endTime = new Date().getTime()
          // 判断若说话时间短于200ms则要求重新录音
          if (endTime - startTime < 1000) {
            MintUI.Toast({
              message: '说话时间太短!',
              duration: 2000
            })
            return
          }
          // 将结果赋值给this.localId
          SDK.translateVoice(res.localId, successFunction)
        },
        fail: function (res) {
          console.log('fail', res)
          if (res.errMsg === 'stopRecord:tooshort') {
            MintUI.Toast({
              message: '说话时间太短',
              duration: 2000
            })
          }
        }
      })
    }
  }
}
export default SDK

function isNativeCall () {
  return MyUtils.getItem('default') === 'worker'
}
