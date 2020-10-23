import { workOrderApi } from '@/assets/api'
import router from '../../router'
import store from '../../store'
import MintUI from 'mint-ui'
import utils from '@/utils/myUtils'
const scanCode = {
  // 调用平台扫码功能
  scanQRCode: async function () {
    if (!store.state.submit) {
      return
    }
    store.commit('setSubmit', false)
    window.TS_Common.nativeCall('scanCode', {}, ret => {
      // 释放点击按钮
      ret = JSON.parse(ret)
      store.commit('setSubmit', true)
      if (ret.cancle === '1') {
        // 用户取消扫码
        console.log('ret.cancle', ret)
        return
      }
      dealScanCode(ret.barcode)
      console.log('ret', ret)
    })
  },
  // 护工主管绑定腕带
  getwristbind: async function (code, successFunction) {
    if (!store.state.submit) {
      return
    }
    store.commit('setSubmit', false)
    window.TS_Common.nativeCall('scanCode', {}, ret => {
      // 释放点击按钮
      ret = JSON.parse(ret)
      store.commit('setSubmit', true)
      if (ret.cancle === '1') {
        // 用户取消扫码
        console.log('ret.cancle', ret)
        return
      }
      let wristBand = ret.barcode
      console.log('ret', ret)
      console.log('wristBand', wristBand)
      MintUI.Indicator.close()
      dowristbind(wristBand, code, 0, successFunction)
    })
  },
  // 护工主管绑铃
  getBind: async function (flag) {
    if (!store.state.submit) {
      return
    }
    store.commit('setSubmit', false)
    if (store.state.bindInfo.orderCode && store.state.bindInfo.hardwareQrCode) {
      store.commit('setBindInit')
    }
    window.TS_Common.nativeCall('scanCode', {}, ret => {
      // 释放点击按钮
      ret = JSON.parse(ret)
      store.commit('setSubmit', true)
      if (ret.cancle === '1') {
        // 用户取消扫码
        console.log('ret.cancle', ret)
        return
      }
      MintUI.Indicator.open('绑定验证中...')
      console.log('success', ret)
      let res = ret.barcode
      console.log('res', res)
      console.log('res.length', res.length)
      const str = res.split('_')
      // 识别为非系统码 直接错误提示
      let data =
        str[0] === 'service' && str[1].length === 22
          ? { orderCode: str[1], hardwareQrCode: store.state.bindInfo.hardwareQrCode }
          : {
            orderCode: store.state.bindInfo.orderCode,
            hardwareQrCode: ret.substring(ret.length - 10)
          }
      // 后台进行校验/绑定操作
      workOrderApi
        .callBind(data)
        .then((resp) => {
          store.commit('setBindInfo', data) // 校验/绑定成功录入信息后跳转至
          store.commit('setBindStatus', 0) // 初始化为成功
        })
        .catch((e) => {
          store.commit('setBindStatus', 1) // 校验或绑定失败,将状态改为异常
        })
        .finally(() => {
          MintUI.Indicator.close()
          router.push({ name: 'bind' }) // 最后跳转至展示页面
        })
    })
  }
}
export default scanCode

function dowristbind (wristBand, code, isCover, successFunction) {
  MintUI.Indicator.open('绑定腕带中...')
  workOrderApi
    .wristBandBind({
      orderCode: code,
      wristBand: wristBand,
      isCover: isCover
    })
    .then((resp) => {
      console.log('resp', resp)
      MintUI.Toast('绑定成功')
      successFunction()
    })
    .catch((e) => {
      if (e.data.errcode === '5005') {
        MintUI.Indicator.close()
        let errmsg = e.data.errmsg || '其他用户'
        // let msg = '该腕带已绑定' + errmsg + ',是否进行变更操作?'
        const htmls = `
        <p class="text-default">该腕带已绑定{` + errmsg + `}</p>
        <p class="text-default">是否进行变更操作?</p>
      `
        MintUI.MessageBox.confirm(htmls).then(() => {
          dowristbind(wristBand, code, 1, successFunction)
        })
      } else {
        MintUI.MessageBox.alert('绑定失败,' + e.data.errmsg)
      }
    })
    .finally(() => {
      MintUI.Indicator.close()
    })
}

function dealScanCode (resultStr) {
  // 扫到的码的关键字，根据角色进行处理
  if (!resultStr) {
    MintUI.MessageBox.alert('请扫描正确二维码')
    return false
  }
  const role = utils.getItem('role')
  const str = resultStr.split('_')
  if (str.length === 2 && str[0] === 'service' && (role === '4' || role === '3' || role === '7' || role === '8')) {
    // 护工主管/护士扫服务码
    workOrderApi
      .getCareOrderNoteId(str[1])
      .then((resp) => {
        router.push({
          name: 'serviceOrderDetail',
          query: { serviceOrderId: resp.data.data }
        })
      })
      .catch((e) => {
        MintUI.MessageBox.alert('请扫描正确二维码')
      })
  } else if (str.length === 2 && str[0] === 'serviceItem' && role === '5') {
    // 护工扫服务项码
    router.push({
      name: 'serviceConfirm',
      query: { orderServiceItemId: str[1] }
    })
  } else {
    // 扫腕带码，获取服务跟踪列表
    let params = {
      pageNo: 1,
      pageSize: 999,
      code: resultStr
    }
    workOrderApi
      .getWorkServices(params)
      .then(resp => {
        console.log(resp)
        const _list = resp.data.data
        if (!_list || _list.length === 0) {
          MintUI.MessageBox.alert('没有相关服务单！')
          return
        }
        // 跳到服务选择页面进行选择
        let ids = []
        _list.forEach(ele => {
          ids.push(ele.id)
        })
        console.log('ids', ids)
        if (role === '5') {
          router.push({
            name: 'serviceSelect',
            query: { serviceIds: ids }
          })
        }
        // 主管/项目经理则是去详情页
        if (role === '3' || role === '4' || role === '7' || role === '8') {
          router.push({
            name: 'serviceOrderDetail',
            query: { serviceOrderIds: ids }
          })
        }
      })
  }
}
