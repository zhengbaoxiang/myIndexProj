<template>
  <div>
    <my-header title="建议与反馈"></my-header>
    <div class="mine-suggest mb65">
      <p class="pb5">照片上传</p>
      <ul class="img-list">
        <li v-for="(url,index) in urlList" :key="index">
          <img :src="path + url" />
          <i class="myicon icon-close" @click.stop="delImg(index)"></i>
        </li>
        <li v-if="urlList.length < LIMITMAX">
          <div class="myicon icon-add" @click="chooseType"></div>
        </li>
      </ul>
      <input
        @change="fileChange($event)"
        type="file"
        accept="image/*"
        id="upload_file"
        style="display: none"
      />
      <!--new  capture表示设备 -->
      <!-- <input   capture="camera"
        @change="fileChange($event)"
        type="file"
        title="阿达"
        accept="image/*"
        id="pho_upload_file"
        style="display: block"> -->

    <!-- <mt-popup v-model="uploadVisible" class="popup">
      <div class="popOption" @click="wxSdk">微信sdk</div>
      <div class="popOption" @click="wxNative">原生方法</div>
    </mt-popup> -->

      <p class="ptb15">问题描述({{note.length}}/500)</p>
      <div class="question">
        <textarea
          name="question"
          class="mint-field-core"
          maxlength="500"
          v-model="note"
          @input="filterNote(note)"
          @blur="restore"
          placeholder="请留下您宝贵的建议"
        ></textarea>
        <my-voiceinput class="mtb10" @recordOk="recordOk"></my-voiceinput>
      </div>

    </div>

    <div class="bottom fixed" @click="submit">
      <mt-button type="primary" size="large">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { mineApi } from '@/assets/api'
import { Indicator } from 'mint-ui'
import SDK from '@/utils/SDK'
import utils from '@/utils/myUtils'
import uploadImage from '@/utils/uploadImage'
import EXIF from 'exif-js'

export default {
  name: 'mine_suggest',
  data () {
    return {
      uploadVisible: false, // 控制上传弹框
      role: utils.getItem('role'),
      path: window.hcsConfig.imgdomain + 'thumbnail_',
      showFace: false,
      imgList: [],
      urlList: [],
      size: 0,
      LIMITMAX: 6, // 限制图片上传的数量
      LIMITMB: 10, // 限制图片上传的大小
      LIMITSIZE: 10 * 1024 * 1024, // 限制图片上传的大小
      compressSize: 1 * 1024 * 1024, // 限制图片上传的大小
      Orientation: null,
      tempImgs: [],
      note: '',
      orderId: this.$route.query.orderId || null
    }
  },
  created () {
    if (
      !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ||
      this.$route.query.fromWechat === '1'
    ) {
      SDK.getWXConfig()
    }
  },
  computed: {
    formTips () {
      if (!this.note) return '问题描述为必填'
      else return false
    }
  },
  watch: {
    imgList: {
      handler (val) {
        if (val.length === this.urlList.length + 1) {
          let formData = new FormData()
          let length = val.length
          formData.append('file', val[length - 1].file)
          formData.append('kind', 0)
          mineApi
            .upload(formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
              console.log('data', response.data.data)
              let fileUrl = response.data.data
              this.urlList.push(fileUrl)
            })
            .catch(response => {
              this.imgList.splice(length - 1, 1)
              this.$MessageBox(response.errmsg || '上传失败,请稍后再试!!!')
            })
            .finally(() => {
              Indicator.close()
              console.log('this.imgList', this.imgList)
              console.log('this.urlList', this.urlList)
            })
        } else if (val.length === this.urlList.length - 1) {
          console.log('删除')
        }
      }
    },
    urlList: {
      handler (val) {
        console.log('watch_urlLIst', val)
      }
    },
    deep: true
  },
  methods: {
    recordOk (val) {
      // this.note = this.note + val
      this.note = utils.noteLimit(this.note + val, 500)
    },
    submit: function () {
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      Indicator.open('正在提交...')
      let data = {
        imgList: this.urlList,
        note: this.note,
        orderId: this.orderId
      }
      mineApi
        .suggest(data)
        .then(response => {
          Indicator.close()
          if (this.orderId) {
            let orderMap =
              utils.jsonToMap(window.localStorage.getItem('orderMap')) ||
              new Map()
            orderMap.set('order_' + this.orderId, 0) // 初始化回复时间
            window.localStorage.setItem('orderMap', utils.mapToJson(orderMap))
          }
          this.$MessageBox({
            title: '提交成功',
            closeOnClickModal: false // 点击model背景层不关闭MessageBox
          }).then(action => {
            this.$router.go(-1)
          })
        })
        .catch(response => {
          Indicator.close()
          this.$MessageBox(response.data.errmsg || '提交失败,请稍后重试')
        })
    },
    chooseType () {
      // console.log('点击新增文件，判断微信或者app？')
      if (uploadImage.isNativeCall()) {
        // console.log('判断工作人员在我要管家APP内')
        this.openAlbum()
      } else {
        // this.uploadVisible = true
        // 微信上传未实现，此处直接使用原有的原生方法
        this.wxNative()
      }
    },
    // 未实现，需要后台协助调试。
    wxSdk () {
      console.log('微信sdk')
      const options = {
        count: this.LIMITMAX - this.urlList.length
      }
      SDK.chooseImage(options, localIds => {
        console.log(localIds)

        localIds.forEach(item => {
          SDK.uploadImage(item, res => {
            console.log(res)
          })
          SDK.getLocalImgData(item, res => {
            console.log(res)
          })
        })

        this.urlList = localIds
      })
    },
    wxNative () {
      console.log('微信端，原生click打开文件')
      document.getElementById('upload_file').click()
    },
    openAlbum () {
      console.log('app打开相册')
      const options = {
        photoOfMax: this.LIMITMAX - this.urlList.length, // 最大选几张
        urls: window.hcsConfig.axiosBaseURL + '/file/uploadSuggestImages'
      }
      uploadImage.openAlbum(options, (result) => {
        const temp = JSON.parse('[' + result + ']')
        this.urlList = this.urlList.concat(
          temp.map(item => {
            return item.uid + item.type
          })
        )
      })
    },
    fileChange (el) {
      if (!el.target.files[0].size) return
      this.fileList(el.target)
      el.target.value = ''
    },
    fileList (fileList) {
      let files = fileList.files
      for (let i = 0; i < files.length; i++) {
        // 判断是否为文件夹
        if (files[i].type !== '') {
          this.fileAdd(files[i])
        } else {
          // 文件夹处理
          this.folders(fileList.items[i])
        }
      }
    },
    // 文件夹处理
    folders (files) {
      let _this = this
      // 判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry()
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i])
          } else {
            _this.folders(file[i])
          }
        }
      })
    },
    foldersAdd (entry) {
      let _this = this
      entry.file(function (file) {
        _this.fileAdd(file)
      })
    },
    fileAdd (file) {
      console.log('filechange', file)

      if (file.size >= this.LIMITSIZE) {
        this.$Toast('图片最多不能超过' + this.LIMITMB + 'Mb')
        return
      }
      if (this.urlList.length >= this.LIMITMAX) {
        this.$Toast('最多可上传' + this.LIMITMAX + ' 张图片')
        return
      }
      // 判断是否为图片文件
      if (file.type.indexOf('image') === -1) {
        this.$Toast('请选择图片文件')
        return
      }
      Indicator.open('上传图片中...')
      let _this = this
      // 判断照片的反转状况
      EXIF.getData(file, function () {
        EXIF.getAllTags(this)
        _this.Orientation = EXIF.getTag(this, 'Orientation')
      })
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        let result = this.result
        let img = new Image()
        img.src = result
        // 判断图片是否大于1M,是就直接上传，反之压缩图片再上传
        if (this.result.length <= 1024 * 1024) {
          _this.imgList.push({
            file: uploadImage.dataURLtoFile(this.result, file.name)
          })
        } else {
          img.onload = function () {
            _this.imgList.push({
              file: _this.compress(img, file.name, _this.Orientation)
            })
          }
        }
      }
    },
    // 压缩图片
    compress (img, filename, Orientation) {
      console.log('Orientation2', Orientation)
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      switch (Orientation) {
        case 6:
          canvas.width = height
          canvas.height = width
          ctx.rotate((90 * Math.PI) / 180)
          ctx.drawImage(img, 0, -img.height)
          break
        case 8:
          canvas.width = height
          canvas.height = width
          ctx.rotate((3 * Math.PI) / 2)
          ctx.drawImage(img, -img.width, 0)
          break
        case 3:
          ctx.rotate(Math.PI)
          ctx.drawImage(img, -img.width, -img.height)
          break
        default:
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      let quality = uploadImage.getQuality(this.compressSize / initSize)
      let ndata = canvas.toDataURL('image/jpeg', quality)
      canvas.width = canvas.height = 0
      console.log('比例：' + quality)
      console.log('压缩前：' + initSize)
      console.log('理想压缩值：' + this.compressSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~((100 * ndata.length) / initSize) + '%')
      // 根据需要返回file或base64
      return uploadImage.dataURLtoFile(ndata, filename)
    },
    // 删除照片
    delImg (index) {
      this.size = this.size - this.imgList[index].file.size // 总大小
      this.imgList.splice(index, 1)
      this.urlList.splice(index, 1)
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    }
  }
}
</script>
<style lang="less" scoped>
.mine-suggest {
  padding: 15px;
  background-color: @background-white;
  /*九宫格*/
  .img-list {
    margin: 10px 5px 0 5px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    li {
      width: calc(94% / 3);
      height: calc(94% / 3);
      padding-top: calc(94% / 3);
      margin-right: 3%;
      margin-bottom: 0;
      position: relative;
      .icon-close {
        position: absolute;
        right: -6px;
        top: -6px;
      }
      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .icon-add {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 50px;
        background-color: #f2f2f2;
        color: rgba(170, 170, 170, 0.5);
      }
      .icon-add:before {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -25px;
      }
    }
    li:nth-of-type(3n) {
      margin-right: 0;
    }
    li:nth-last-of-type(n + 4) {
      margin-bottom: 3%;
    }
  }
  .question {
    width: 100%;
    // padding: @m15;
    box-sizing: border-box;
    border: 0.5px solid rgba(236, 236, 243, 1);
    border-radius: 1px;
    box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
    background-color: @color-white;
    font-size: @font-size-normal;
    textarea {
      font-size: @font-size-small;
      padding: @m15;
      box-sizing: border-box;
      height: 120px;
    }
  }
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
}
</style>
