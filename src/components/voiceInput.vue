<template>
  <div class="my-voice-input mlr15">
    <div class="voice-input-left">
      <span
        class="mint-badge ml5"
        :class="currentIndex > index ? 'primary' : 'unprimary'"
        v-for="index in 20"
        :style="{'padding-top': currentIndex > index ? currentList[(currentIndex-index)%7] +'px':'5px' ,
                'padding-bottom': currentIndex > index ?currentList[(currentIndex-index)%7] +'px': '5px' }"
        :key="index"
      ></span>
    </div>
    <div class="voice-input-right" @touchstart="recordStart" @touchend="recordEnd(false)">
      <span class="font14 text-grey ml10">{{touching?'识别中...':'按住说话'}}</span>
      <div class="voice fr voice-icon"></div>
      <div class="voice-right fr voice-icon"></div>
      <!-- <img
        class="voice"
        src="../assets/imgs/voice@2x.png"
      />-->
    </div>
  </div>
</template>
<script>
import SDK from '@/utils/SDK'
import record from './record'
export default {
  name: 'my-voiceinput',
  props: {},
  data () {
    return {
      touching: false,
      startTime: 0,
      endTime: 0,
      currentIndex: 1,
      indexList: [],
      // indexList1: [5, 6.5, 7, 7.5, 9, 8, 7, 6.5, 5, 4],
      currentList: [3, 5, 7, 9, 7, 5, 3],
      timer: null,
      autoendTimer: null
    }
  },
  created () {
    // ios将在进入项目时由scanCode.js中统一添加至jsApiList
    // 所以在这里屏蔽ios的config配置,防止调用失败
    if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      SDK.getWXConfig()
    }
  },
  methods: {
    // 初始化微信配置
    // 开始录音
    recordStart (e) {
      // 添加阻止click事件触发
      clearInterval(this.timer)
      this.resetCount()
      this.recordEnd(true)
      e.preventDefault()
      console.log(e)
      // this.init()
      // 记录开始时间
      this.startTime = new Date().getTime()
      // 更新录音状态
      this.touching = true
      // 开始录音
      record.recordStart()
      // 绘制语音水波纹
      this.timer = setInterval(() => {
        // this.countDown(4, 9)
        this.currentIndex = this.currentIndex + 1
      }, 150)
      let _this = this
      // 设置超过15s自动停止录制的定时器
      this.autoendTimer = setTimeout(function () {
        console.log('autoendTimer')
        // 说明15S还未结束,在这里执行自动停止代码
        // 若15S后,_this.touching = false
        // 说明touchend事件已被触发,无需强制停止
        if (_this.touching) {
          console.log('超过15S自动结束')
          _this.$Toast({
            message: '超过15S自动结束!',
            duration: 2000
          })
          // 强制停止语音录制
          clearInterval(_this.timer)
          _this.resetCount()
          _this.recordEnd(true)
        }
        // 清除15S定时器
        clearTimeout(_this.autoendTimer)
      }, 15000)
    },
    /*
      结束录音
      fouce:是否强制执行停止语音
      可选参数: true/false
    */
    recordEnd (fouce) {
      // 清除15S自动停止语音的定时器
      clearTimeout(this.autoendTimer)
      clearInterval(this.timer)
      this.resetCount()
      // 停止水波纹图案录制并初始化展示状态
      console.log('fouce', fouce)
      console.log('_this.touching', this.touching)
      // 若超过15S,则拦截touchend事件执行
      if (!fouce && !this.touching) {
        console.log('!fouce && !_this.touching')
        return
      }
      // 更新touch状态
      this.touching = false
      // 微信停止录音方法
      record.recordEnd(this.startTime, data => {
        this.$emit('recordOk', data)
      })
    },
    // 重置语音水波纹展示样式
    resetCount () {
      this.currentIndex = 1
      this.indexList = []
    }
    // // 语音翻译功能
    // translateVoice (localId) {
    //   let _this = this
    //   wx.translateVoice({
    //     localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
    //     isShowProgressTips: 1, // 默认为1，显示进度提示
    //     success: function (res) {
    //       // 更新页面展示状态
    //       // 语音识别的结果
    //       _this.$emit('recordOk', res.translateResult || '')
    //     }
    //   })
    // },
    // 倒计时功能,用来展示动态语音水波条
    // countDown (min, max) {
    //   if (this.currentIndex <= 20) {
    //     // 随机产生范围内的数字代表柱体的高度
    //     this.currentIndex = this.currentIndex + 1
    //     let range = max - min
    //     var rand = Math.random() //  rand >=0  && rand < 1
    //     let temp = Math.round(rand * range) + min
    //     // 向indexList中添加item
    //     // 该item表示对应顺序的语音水波纹的padding-top&bottom
    //     this.indexList.push(temp)
    //   } else {
    //     // 当所有柱体变蓝后重置
    //     this.resetCount()
    //   }
    // },
  }
}
</script>

<style lang="less">
.my-voice-input {
  position: relative;
  height: 38px;
  line-height: 35px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 1);
  border: 0.5px solid rgba(236, 236, 243, 1);
  .voice-input-left {
    position: absolute;
    left: 10px;
    vertical-align: middle;
    .primary {
      background-color: #1fc1c9;
    }
    .unprimary {
      background-color: rgba(31, 193, 201, 0.1);
    }
    .mint-badge {
      vertical-align: middle;
      font-size: 15px;
      border-radius: 20px;
      padding: 5px 1.5px;
    }
  }
  .voice-input-right {
    position: absolute;
    // position: fixed;
    right: 10px;
    span {
      background-color: rgba(255, 255, 255, 1);
    }
    .voice-icon {
      touch-action: none;
      margin-top: 9px;
      width: 16px;
      height: 18px;
      background-position: center center;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .voice-right {
      margin-top: 10px;
      height: 16px;
      background-image: url("../assets/imgs/icon-right@2x.png");
    }
    .voice {
      background-image: url("../assets/imgs/voice@2x.png");
    }
    // img {
    //   pointer-events: none;
    // }
    // img {
    //   pointer-events: none;
    //   // vertical-align: sub;
    // }
  }
}
</style>
