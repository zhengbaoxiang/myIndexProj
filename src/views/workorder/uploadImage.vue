<template>
  <div >
      <div class="popOption" @click="openCamera">拍摄</div>
      <div class="popOption" @click="openAlbum">从相册上传</div>
    </div>
</template>
<script>
// import SDK from '@/utils/SDK'
import uploadImage from '@/utils/uploadImage'
import { workOrderApi } from '@/assets/api'
export default {
  data () {
    return {
      urlList: [],
      size: 0,
      LIMITMAX: 6 // 限制图片上传的数量
    }
  },
  props: {
    uploadUrl: {
      type: String
    },
    addUrl: {
      type: String
    },
    urlListLength: {
      default: 0
    },
    currentServerId: {
      default: -2
    }
  },
  watch: {
    currentServerId (val, oldval) {
      if (val !== oldval) {
        this.urlList = []
      }
    }

  },
  updated () {
  },
  mounted () {
  },
  methods: {
    joinParams (params) {
      let paramsStr = ''
      let temp = []
      for (let key in params) {
        const value = params[key]
        if (Array.isArray(value)) {
          const newList = value.map(item => {
            return key + '=' + item
          })
          temp.push(newList.join('&'))
        } else {
          temp.push(key + '=' + value)
        }
        console.log(temp)
      }
      paramsStr = '?' + temp.join('&')
      console.log(59, paramsStr)
      return paramsStr
    },
    addPhoto (photoList) {
      const params = {
        id: this.currentServerId,
        fileNames: photoList
      }
      const paramsStr = this.joinParams(params)
      workOrderApi
        .addPhoto(paramsStr)
        .then(resp => {
          console.log('addphoto_res', resp.data.errmsg)
        })
    },
    openCamera () {
      const options = {
        urls: this.uploadUrl
      }
      // 拍照上传
      uploadImage.openCamera(options, result => {
        this.loadSuccess(result)
      })
    },
    openAlbum () {
      const options = {
        photoOfMax: this.LIMITMAX - this.urlListLength, // 最大选几张
        // urls: window.hcsConfig.axiosBaseURL + '/file/uploadSuggestImages'//建议与反馈
        urls: this.uploadUrl
      }
      uploadImage.openAlbum(options, result => {
        this.loadSuccess(result)
      })
    },
    // 上传成功后，处理响应uid与type
    loadSuccess (result) {
      /* {
            "addrUrl": "{"uid":"2020091011340820124153_QQ截图20200910112539",
            "path":"D:\",
            "fileName":"QQ截图20200910112539",
            "type":".jpg",
            "status":1}"
          } */
      const temp = JSON.parse('[' + result + ']')
      this.urlList = temp.map(item => {
        return item.uid + item.type
      })

      this.addPhoto(this.urlList)
      this.$emit('uploadSuccess', this.urlList)
    }

  }
}
</script>
<style lang="less" scoped>
.popup{
    width: 90%;
    border-radius: 4px;
    height: 100px;
    overflow: hidden;

    .popOption{
      height: 40px;
      line-height: 40px;
      padding: 5px 20px;
      font-size: 14px;
      border-bottom: 1px solid #e0e0e0;
    }
  }
</style>
