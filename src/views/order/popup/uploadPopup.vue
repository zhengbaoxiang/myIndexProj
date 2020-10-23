<template>
  <mt-popup
    class="mint-msgbox offline-popup"
    v-model="visible"
    :closeOnClickModal="false"
  >
    <div class="title">
      <div class="text-default">完成退款，请上传退款单图片</div>
      <!-- <input
        @change="fileChange($event)"
        type="file"
        accept="image/*"
        id="upload_file"
        style="display: none"
      /> -->
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">
        取消
      </button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="chooseType">
        上传照片
      </button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'
// import EXIF from 'exif-js'
// import { Toast } from 'mint-ui'
import uploadImage from '@/utils/uploadImage'

export default {
  data () {
    return {
      // limitMB: 10, // 限制图片上传的大小
      // limitSize: 10 * 1024 * 1024, // 限制图片上传的大小,
      // toastInstanse: null
    }
  },
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    }
  },
  methods: {
    cancel () {
      if (!this.$store.state.submit) {
        return
      }
      this.$emit('update:visible', false)
    },
    chooseType () {
      if (!this.$store.state.submit) {
        return
      }
      if (uploadImage.isNativeCall()) {
        const options = {
          photoOfMax: 1, // 最大选几张
          urls: window.hcsConfig.axiosBaseURL + '/file/uploadRefundImages'
        }
        uploadImage.openAlbum(options, (result) => {
          const temp = JSON.parse('[' + result + ']')
          const image = temp[0]
          console.log('bindOrderRefundPicUrl: ' + image.uid + image.type)
          this.bindOrderRefundPicUrl({ data: image.uid + image.type })
        })
      } else {
        // document.getElementById('upload_file').click()
      }
    },

    // fileChange (el) {
    //   // this.$Indicator.open({
    //   //   text: '上传图片中...'
    //   // })
    //   // 锁定支付按钮
    //   this.$store.commit('setSubmit', false)
    //   // this.$emit('update:visible', false)
    //   this.toastInstanse = Toast({
    //     message: '正在上传,请稍等...',
    //     duration: -1
    //   })
    //   if (!el.target.files[0].size) return
    //   this.fileList(el.target)
    //   el.target.value = ''
    // },
    // fileList (fileList) {
    //   let files = fileList.files
    //   for (let i = 0; i < files.length; i++) {
    //     // 判断是否为文件夹
    //     if (files[i].type !== '') {
    //       this.fileAdd(files[i])
    //     } else {
    //       // 文件夹处理
    //       this.folders(fileList.items[i])
    //     }
    //   }
    // },
    // // 文件夹处理
    // folders (files) {
    //   let _this = this
    //   // 判断是否为原生file
    //   if (files.kind) {
    //     files = files.webkitGetAsEntry()
    //   }
    //   files.createReader().readEntries(function (file) {
    //     for (let i = 0; i < file.length; i++) {
    //       if (file[i].isFile) {
    //         _this.foldersAdd(file[i])
    //       } else {
    //         _this.folders(file[i])
    //       }
    //     }
    //   })
    // },
    // foldersAdd (entry) {
    //   let _this = this
    //   entry.file(function (file) {
    //     _this.fileAdd(file)
    //   })
    // },
    // fileAdd (file) {
    //   if (file.size >= this.limitSize) {
    //     this.toastInstanse.close()
    //     this.$Toast('图片最多不能超过' + this.limitMB + 'Mb')
    //     return
    //   }
    //   // 判断是否为图片文件
    //   if (file.type.indexOf('image') === -1) {
    //     this.toastInstanse.close()
    //     this.$Toast('请选择图片文件')
    //     return
    //   }
    //   let _this = this
    //   // 判断照片的反转状况
    //   EXIF.getData(file, function () {
    //     EXIF.getAllTags(this)
    //     _this.Orientation = EXIF.getTag(this, 'Orientation')
    //   })
    //   let reader = new FileReader()
    //   reader.readAsDataURL(file)
    //   reader.onload = function () {
    //     let result = this.result
    //     let img = new Image()
    //     img.src = result
    //     _this.upload({
    //       file: uploadImage.dataURLtoFile(this.result, file.name)
    //     })
    //     // 判断图片是否大于1M,是就直接上传，反之压缩图片再上传
    //     // if (this.result.length <= 1024 * 1024) {
    //     //   _this.upload({
    //     //     file: _this.dataURLtoFile(this.result, file.name)
    //     //   })
    //     // } else {
    //     //   img.onload = function () {
    //     //     _this.upload({
    //     //       file: _this.compress(img, file.name, _this.Orientation)
    //     //     })
    //     //   }
    //     // }
    //   }
    // },
    // upload (file) {
    //   let formData = new FormData()
    //   formData.append('file', file.file)
    //   formData.append('kind', 1)
    //   mineApi
    //     .upload(formData, {
    //       headers: { 'Content-Type': 'multipart/form-data' }
    //     })
    //     .then((response) => {
    //       this.bindOrderRefundPicUrl(response.data)
    //     })
    //     .catch((response) => {
    //       this.toastInstanse.close()
    //       this.$MessageBox(response.errmsg || '上传失败,请稍后再试!!!')
    //       this.$store.commit('setSubmit', true)
    //     })
    // },
    bindOrderRefundPicUrl (result) {
      orderApi
        .refundApprove(this.orderId, 1, result.data)
        .then((json) => {
          // this.$Indicator.close()
          // if (this.toastInstanse) {
          //   this.toastInstanse.close()
          // }
          this.$Toast({
            message: '上传成功',
            duration: 2000
          })
          this.$emit('uploadRefundOk', {})
        })
        .catch((e) => {
          // if (this.toastInstanse) {
          //   this.toastInstanse.close()
          // }
          this.$MessageBox(e.data.errmsg || '退款申请失败,请稍后再试!!!')
        })
        .finally(() => {
          this.$emit('update:visible', false)
          // setTimeout(() => {
          //   this.$store.commit('setSubmit', true)
          // }, 300)
        })
    }
    // 压缩图片
    // compress (img, filename, Orientation) {
    //   console.log('Orientation2', Orientation)
    //   let canvas = document.createElement('canvas')
    //   let ctx = canvas.getContext('2d')
    //   let initSize = img.src.length
    //   let width = img.width
    //   let height = img.height
    //   canvas.width = width
    //   canvas.height = height
    //   switch (Orientation) {
    //     case 6:
    //       canvas.width = height
    //       canvas.height = width
    //       ctx.rotate((90 * Math.PI) / 180)
    //       ctx.drawImage(img, 0, -img.height)
    //       break
    //     case 8:
    //       canvas.width = height
    //       canvas.height = width
    //       ctx.rotate((3 * Math.PI) / 2)
    //       ctx.drawImage(img, -img.width, 0)
    //       break
    //     case 3:
    //       ctx.rotate(Math.PI)
    //       ctx.drawImage(img, -img.width, -img.height)
    //       break
    //     default:
    //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    //   }
    //   let quality = uploadImage.getQuality(this.compressSize / initSize)
    //   let ndata = canvas.toDataURL('image/jpeg', quality)
    //   canvas.width = canvas.height = 0
    //   // 根据需要返回file或base64
    //   return uploadImage.dataURLtoFile(ndata, filename)
    // }
  }
}
</script>

<style lang="less">
.offline-popup {
  overflow: visible;
  .title {
    position: relative;
    text-align: center;
    padding: 35px 0;
    img {
      position: absolute;
      width: 50%;
      top: -10%;
      left: 50%;
      margin-left: -25%;
    }
  }
}
</style>
