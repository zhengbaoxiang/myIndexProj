import MyUtils from '@/utils/myUtils'

const uploadImage = {
  // 管家app，打开相机
  openCamera: (options, callback) => {
    console.log('打开相机api')
    const params = {
      quality: 50, // 照片质量（0-100）
      encodingType: 'JPEG', // 照片格式，建议使用JPEG
      targetWidth: 400, // 照片宽度
      targetHeight: 600, // 照片高度
      urls: options.urls// 上传路径
    }
    try {
      window.TS_Common.nativeCall('cameraPic', params, (result) => {
        console.log('openCamera成功回调参数:' + result)
        callback(result)
      })
    } catch (err) {
      console.log(err)
    }
  },
  // 我要管家APP调用选中图片接口
  openAlbum: (options, callback) => {
    console.log('打开相册api')
    try {
      window.TS_Common.nativeCall('selectedImgs', options, (result) => {
        console.log('selectedImgs成功回调参数:' + result)
        callback(result)
      })
    } catch (err) {
      console.log(err)
    }
  },
  // 判断是否是工作人员在我要管家APP内
  isNativeCall: () => {
    return MyUtils.getItem('default') === 'worker'
  },

  // 将base64转换为文件
  dataURLtoFile: (dataurl, filename) => {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  },
  // 获取图片压缩的比例
  getQuality: (ratio) => {
    if (ratio > 0.94) {
      return 0.96
    } else if (ratio > 0.87 && ratio <= 0.94) {
      return 0.95
    } else if (ratio > 0.75 && ratio <= 0.87) {
      return 0.94
    } else if (ratio > 0.55 && ratio <= 0.75) {
      return 0.93
    } else if (ratio > 0.47 && ratio <= 0.55) {
      return 0.9
    } else if (ratio > 0.35 && ratio <= 0.47) {
      return 0.85
    } else if (ratio > 0.28 && ratio <= 0.35) {
      return 0.8
    } else if (ratio > 0.22 && ratio <= 0.28) {
      return 0.7
    } else if (ratio > 0.14 && ratio <= 0.22) {
      return 0.5
    } else if (ratio > 0.1 && ratio <= 0.14) {
      return 0.3
    } else {
      return 0.05
    }
  }
}

export default uploadImage
