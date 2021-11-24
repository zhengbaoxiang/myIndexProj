<template>
<div class="baiduOCR">
  <div class="upload">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      drag
      :before-upload="beforeUpload"
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <img :src="imgUrl" alt="暂无图片">
  </div>
  <div class="textZone">
    <textarea name="" id="textareaId" cols="30" rows="10"></textarea>
    <button @click="copyText(textValue)">复制</button>
  </div>

</div>
</template>
<script>
import myUtils from '@/utils/myUtils'
import { baiduApi } from '@/assets/api'
export default {
  data () {
    return {
      token: '',
      imgUrl: '',
      textValue: ''
    }
  },
  created () {
  },
  mounted () {
    this.initialData()
  },
  activated () {},
  methods: {
    initialData () {
      const params = {
        grant_type: 'client_credentials',
        client_id: 's0n52bsvKpNG4wYOwa6riMIC',
        client_secret: 'agpeLIebtveKRxt07eln4Mht62f9GzyQ'
      }
      baiduApi.getToken(params).then(res => {
        this.token = res.access_token
      })
    },
    getWords (url) {
      const token = this.token
      let temp = encodeURIComponent(url.split(',')[1])
      const imageUrl = 'image=' + temp

      baiduApi.getWords(imageUrl, token).then(res => {
        // console.log('res', res)
        let temp = res.words_result || []
        let list = temp.map(item => {
          return item.words
        })
        // this.textValue = `调用方式
        //   调用AI服务相关的AP接口有两种调用方式，两种不同的调用方式采用相同的接口URL。
        //   区别在于请求方式和鉴权方法不一样，请求参数和返回结果一致。
        //   【如果您对于使用AP调用的方式很陌生，您可以参见：【只要10分钟快速掌握文字识别】教程】
        //   调用方式一
        //   请求URL数据格式
        //   向API服务地址使用POST发送请求，必须在URL中带上参数：
        //   access token：必须参数，参考“Access Token获取3333”。`
        this.textValue = list.join('\n')
        this.copyText(this.textValue)
      })
    },
    inputChange (event) {
      let file = event.target.files[0]
      // console.log(file)
      this.blobToDataURL(file, (url) => {
        // console.log(175, url)
      })
    },
    beforeUpload (file) {
      // console.log(file)
      this.blobToDataURL(file, (url) => {
        // console.log(181, url)
        this.imgUrl = url
        this.getWords(url)
      })
      return false
    },
    blobToDataURL (blob, callback) {
      const reader = new FileReader()
      reader.onload = (event) => {
        // console.log('event', event)
        let base64Url = event.target.result
        // const base64Url = event.currentTarget.result
        // const base64Url = event.srcElement.result
        callback(base64Url)
      }
      reader.readAsDataURL(blob)
    },
    copyText (text) {
      var textarea = document.getElementById('textareaId')
      textarea.value = text
      textarea.select()
      document.execCommand('copy')
    }

  }
}
</script>
<style lang="less" >
.baiduOCR{
  height: 100%;
  padding: 20px;
  .upload , .textZone{
    display: inline-block;
    width: 49%;
    height: 700px;
    vertical-align: middle;
  }
  .upload{
    .upload-demo{
      .el-upload .el-upload-dragger{
        width: 600px;
        height: 300px;
      }
    }
     img{
       margin-top: 20px;
      max-width: 600px;
      max-height: 600px;
    }
  }

  .textZone{
    #textareaId{
      width: 100%;
      height: 600px;
    }
  }

}

</style>
