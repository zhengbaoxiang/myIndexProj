
import wx from 'weixin-js-sdk'
import MintUI from 'mint-ui'
import MyUtils from '@/utils/myUtils'

const record = {
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
          record.translateVoice(res.localId, successFunction)
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

export default record

function isNativeCall () {
  return MyUtils.getItem('default') === 'worker'
}

// function dowristbind (wristBand, code, isCover, successFunction) {
//   MintUI.Indicator.open('绑定腕带中...')
//   workOrderApi
//     .wristBandBind({
//       orderCode: code,
//       wristBand: wristBand,
//       isCover: isCover
//     })
//     .then((resp) => {
//       console.log('resp', resp)
//       MintUI.Toast('绑定成功')
//       successFunction()
//     })
//     .catch((e) => {
//       if (e.data.errcode === '5005') {
//         MintUI.Indicator.close()
//         MintUI.MessageBox.confirm('该腕带码已被绑定，是否继续操作?').then(() => {
//           dowristbind(wristBand, code, 1, successFunction)
//         })
//       } else {
//         MintUI.MessageBox.alert('绑定失败,' + e.data.errmsg)
//       }
//     })
//     .finally(() => {
//       MintUI.Indicator.close()
//     })
// }
