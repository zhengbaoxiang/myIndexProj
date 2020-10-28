// import store from '../store'
import { myApi } from '@/assets/api'

const Utils = {
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  dateFormat: function (fmt) {
    // author: meizz
    var o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  },

  // 获取str中的参数并转换为map返回
  getParamsMap: function (str) {
    let num
    let ret = new Map()
    var arr = str.split('&') // 各个参数放到数组里
    console.log(window.location.href)
    console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf('=')
      console.log(arr[i].substring(0, num), arr[i].substr(num + 1))
      if (num > 0) {
        console.log(ret)
        ret.set(arr[i].substring(0, num), arr[i].substr(num + 1))
      }
    }
    return ret
  },

  // 统一处理接口返回的数据，先从localStorage中读取
  getApiData (saveName, apiName, apiParams, callback) {
    // 使用resp.result.data获取数据

    const myDataListStr = window.localStorage.getItem(saveName)
    if (myDataListStr) {
      console.log('获取本地存储saveName =', saveName)
      callback(JSON.parse(myDataListStr))
      return
    }
    // 如果本地没有存储过，则使用接口数据
    myApi[apiName](apiParams).then((resp) => {
      console.log(apiName, apiParams, '接口resp', resp)
      const dataListStr = JSON.stringify(resp.result)
      window.localStorage.setItem(saveName, dataListStr)
      callback(resp.result)
    })
  },

  // json转换为map
  jsonToMap: function (json) {
    if (!json) {
      return null
    }
    let obj = JSON.parse(json)
    let map = new Map()
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k])
    }
    return map
  },
  // map转换为json
  mapToJson: function (m) {
    let obj = Object.create(null)
    for (let [k, v] of m) {
      obj[k] = v
    }
    return JSON.stringify(obj)
  },

  /**
   * 手机号码校验
   */
  validatePhoneNumber: function (value) {
    return !!(value && value.toString().length === 11 && (/^[1][3-9]\d{9}$/).test(value))
  },
  /**
   * 手机号码校验，可为空
   */
  validatePhoneAllowEmpty: function (value) {
    return !value || !!(value && value.toString().length === 11 && (/^[1][3-9]\d{9}$/).test(value))
  },
  /**
   * 操作cookie
   */
  getCookie: function (name) {
    var arr; var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    // eslint-disable-next-line
    if (arr = document.cookie.match(reg)) { return (arr[2]) } else { return null }
  },
  setCookie: function (name, value, expireDates) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expireDates)
    document.cookie = name + '=' + escape(value) + ((expireDates == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  delCookie: function (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
  },
  /* 过滤表情等特殊字符 */
  filterEmoji: function (textwords) {
    if (typeof textwords !== 'string') {
      return false
    }
    var pattern = /[^A-Za-z0-9。.？?！!，,、；;：:“”‘’"'（ ）[\]{}()［］【】—｛｝＿•．《》〈〉<>—_*×□/▲●～~…→@#￥%&—\-／=\s\n\u4e00-\u9fa5]/g
    textwords = textwords.replace(pattern, '').replace(/[\r\n]/g, '') // 去除换行符
    textwords = this.trim(textwords) // 去除空格
    return textwords
  },
  /* 更严格的过滤表情等特殊字符，不允许输入标点符号等 */
  filterEmojiStrict: function (textwords) {
    if (typeof textwords !== 'string') {
      return false
    }
    var pattern = /[^A-Za-z0-9\u4e00-\u9fa5]/g
    textwords = textwords.replace(pattern, '')
    return textwords
  },
  // 判断字符串是否包含emoji字符
  isEmojiCharacter: function (substring) {
    if (/[\ud800-\udbff][\udc00-\udfff]/g.test(substring)) {
      return true
    }
  },
  filterPrice (price) {
    if (!price) return
    price = price.replace(/[^\d.]/g, '') // 仅保留数字和"."
    price = price.replace(/\.{2,}/g, '.') // 两个连续的"."仅保留第一个"."
    price = price.replace('.', '$#*').replace(/\./g, '').replace('$#*', '.') // 去除其他"."
    price = price.replace(/^(\d+)\.(\d\d).*$/, '$1.$2') // 限制只能输入两个小数
    if (price.indexOf('.') < 0 && price !== '' && price !== '0') {
      // 首位是0的话去掉
      price = parseFloat(price)
    }
    // let _oldPrice = parseFloat(this.oldPrice)
    // if (price > this.oldPrice) {
    //   price = _oldPrice
    // }
    return price
  },
  // 删除左右两端的空格
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  // 限制备注信息字数不超过length
  noteLimit: function (note, maxLength) {
    return note.length > maxLength ? note.substring(0, maxLength) : note
  },
  // 该方法用于判断 wxApi.getwexinsign 需要传递的url为当前域名domain(true) 还是 当前页面url(false)
  needUrl: function () {
    return !this.isIOS()
  },
  /* 判断操作系统是否为IOS */
  isIOS: function () {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  },
  /* 判断操作系统是否为IOS */
  getUrl: function () {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  }

}

export default Utils
