<template>
    <div class="baiduOCR">
        <div class="upload">
            <div class="selectZone">
                <el-radio v-model="ocrType" :label="0">标准版(测试用)</el-radio>
                <el-radio v-model="ocrType" :label="1">高精度版</el-radio>
                <el-radio v-model="ocrType" :label="2">手写文字识别</el-radio>
            </div>
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                drag
                :before-upload="beforeUpload"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    只能上传jpg/png文件，且不超过500kb
                </div>
            </el-upload>
            <img :src="imgUrl" alt="暂无图片" />
        </div>
        <div class="textZone">
            <textarea
                name=""
                id="textareaId"
                cols="30"
                rows="10"
                v-model="textValue"
            ></textarea>
            <div class="buttonZone">
                <button @click="copyText(textValue)">复制</button>
            </div>
        </div>
    </div>
</template>
<script>
import { blobToDataURL } from '@/libs/util'
import { baiduApi } from '@/api/api'
export default {
    data() {
        return {
            token: '',
            ocrType: 0,
            imgUrl: '123',
            textValue: ``
        }
    },
    created() {},
    mounted() {
        this.initialData()
    },
    activated() {},
    methods: {
        initialData() {
            const params = {
                grant_type: 'client_credentials',
                client_id: 's0n52bsvKpNG4wYOwa6riMIC',
                client_secret: 'agpeLIebtveKRxt07eln4Mht62f9GzyQ'
            }
            baiduApi.getToken(params).then((res) => {
                this.token = res.data.access_token
                console.log('->', res,'<');
                
                console.log('->', this.token,'<');
                
            })
        },

        inputChange(event) {
            let file = event.target.files[0]
            // console.log(file)
            blobToDataURL(file, (url) => {
                // console.log(175, url)
            })
        },
        beforeUpload(file) {
            // console.log(file)
            blobToDataURL(file, (url) => {
                // console.log(181, url)
                this.imgUrl = url
                this.getWords(url)
            })
            return false
        },

        getWords(url) {
            const token = this.token
            const imageUrl = 'image=' + encodeURIComponent(url.split(',')[1])

            // 根据选项类型，切换精确接口
            let apiName = ''
            if (this.ocrType === 1) {
                apiName = 'accurate_basic'
            } else if (this.ocrType === 2) {
                apiName = 'handwriting'
            } else {
                apiName = 'general_basic'
            }

            baiduApi[apiName](imageUrl, token).then((res) => {
                // console.log('res', res)
                let temp = res.data.words_result || []
                let list = temp.map((item) => {
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
        copyText(text) {
            var textarea = document.getElementById('textareaId')
            textarea.value = text
            textarea.select()
            document.execCommand('copy')
        }
    }
}
</script>
<style lang="less">
.baiduOCR {
    height:  ~'calc(100% - 20px)';
    padding: 10px;

    .upload,
    .textZone {
        display: inline-block;
        width: 50%;
        height: 100%;
        vertical-align: middle;
    }
    .upload {
        text-align: center;
        .selectZone {
            height: 25px;
        }
        .upload-demo {
            .el-upload {
                width: 100%;
                .el-upload-dragger {
                    width: 80%;
                    height: 180px;
                    margin: 0 auto;
                }
            }
        }
        img {
            margin-top: 10px;
            max-width: 90%;
            max-height: 500px;
        }
    }

    .textZone {
        #textareaId {
            width: 100%;
            height: 90%;
            font-size: 18px;
        }
        .buttonZone {
            margin: 20px auto 0;
            text-align: center;
            button {
                height: 40px;
                width: 150px;
            }
        }
    }
}
</style>
