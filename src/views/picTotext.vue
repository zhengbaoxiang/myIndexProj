<template>
<div class="baiduOCR">
  <div class="upload">
    <div class="selectZone">
      <el-radio v-model="ocrType" :label="0">标准版(测试用)</el-radio>
      <el-radio v-model="ocrType" :label="1">高精度版</el-radio>
    </div>
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
    <textarea name="" id="textareaId" cols="30" rows="10"
    v-model="textValue"></textarea>
    <button @click="copyText(textValue)">复制</button>
  </div>

</div>
</template>
<script>
import { blobToDataURL } from '@/utils/myUtils'
import { baiduApi } from '@/assets/api'
export default {
  data () {
    return {
      token: '',
      ocrType: 0,
      imgUrl: '',
      textValue: `第一阶段：1949年9月第一届全国政协通过《共同纲领》等重要文件，指出要废除国
        民党反动政府一切压迫人民的法律、法令和司法制度，制定保护人民的法律、法令，建立人
        民司法制度。开始了中华人民共和国法治建设的历程。
        第二阶段：20世纪50年代，是中国社会主义法制的初创时期。我国最早颁布的两部法
        律便是1950年的《中华人民共和国婚姻法》和《中华人民共和国土地改革法》，其中婚姻法
        是第一部颁布并实行的法律，无论是婚姻法还是土地改革法，都关乎民生问题，可见在建国
        初期，我国就已经将民生问题作为国家治理的重中之重。习近平总书记说：“追求男女平等
        的事业是伟大的。纵观历史，没有妇女解放和进步，就没有人类解放和进步。”新中国第一
        部法律是婚姻法，体现了我国对妇女地位的重视和对妇女权利的保障。
        1954年第一届全国人民代表大会第一次会议，制定了《中华人民共和国宪法》，《中华
        人民共和国国务院组织法》，《中华人民共和国人民法院组织法》，《中华人民共和国人民检察
        院组织法》确立了社会主义中国的政治制度，立法制度，司法制度，初步奠定了中国法治建
        设的基础。`
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

    inputChange (event) {
      let file = event.target.files[0]
      // console.log(file)
      blobToDataURL(file, (url) => {
        // console.log(175, url)
      })
    },
    beforeUpload (file) {
      // console.log(file)
      blobToDataURL(file, (url) => {
        // console.log(181, url)
        this.imgUrl = url
        this.getWords(url)
      })
      return false
    },
    getWords (url) {
      const token = this.token
      let temp = encodeURIComponent(url.split(',')[1])
      const imageUrl = 'image=' + temp

      // 根据选项类型，切换精确接口
      let apiName = ''
      if (this.ocrType === 1) {
        apiName = 'accurate_basic'
      } else {
        apiName = 'general_basic'
      }

      baiduApi[apiName](imageUrl, token).then(res => {
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
    .selectZone{
      height: 100px;

    }
    .upload-demo{
      .el-upload .el-upload-dragger{
        width: 600px;
        height: 300px;
      }
    }
     img{
        margin-top: 20px;
        max-width: 90%;
        max-height: 600px;
    }
  }

  .textZone{
    #textareaId{
      width: 100%;
      height: 600px;
      font-size: 18px;
    }
  }

}

</style>
