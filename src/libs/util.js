import config from '@/config'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
    setLocal(TOKEN_KEY)
}
export const getToken = () => {
    getLocal(TOKEN_KEY)
}

export const setLocal = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v))
}
export const getLocal = (k) => {
    return (
        (localStorage.getItem(k) && JSON.parse(localStorage.getItem(k))) || ''
    )
}

export const setSession = (k, v) => {
    sessionStorage.setItem(k, JSON.stringify(v))
}
export const getSession = (k) => {
    return (
        (sessionStorage.getItem(k) && JSON.parse(localStorage.getItem(k))) || ''
    )
}

// 将读取的二进制图片，转为base64 URl可直接赋值给src
export const blobToDataURL = (blob, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
        // console.log('event', event)
        let base64Url = event.target.result
        // const base64Url = event.currentTarget.result
        // const base64Url = event.srcElement.result
        callback(base64Url)
    }
    reader.readAsDataURL(blob)
}

// 获取str中的参数并转换为map返回
export const getParamsMap = (str) => {
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
}

const myReg = {
    /**
     * 手机号码校验
     */
    validatePhoneNumber: function(value) {
        return !!(
            value &&
            value.toString().length === 11 &&
            /^[1][3-9]\d{9}$/.test(value)
        )
    },
    /**
     * 手机号码校验，可为空
     */
    validatePhoneAllowEmpty: function(value) {
        return (
            !value ||
            !!(
                value &&
                value.toString().length === 11 &&
                /^[1][3-9]\d{9}$/.test(value)
            )
        )
    }
}
export default myReg
