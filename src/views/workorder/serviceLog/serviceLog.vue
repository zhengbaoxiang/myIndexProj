<template>
  <div class="serviceLog" ref="content">
    <my-header title="护理日志"></my-header>
    <template v-if="serviceOrder">
      <!-- 选择日期区域，推送进入不可见 -->
      <div ref="title" v-if="!isFromWechat">
        <select-date
          :serviceOrder="serviceOrder"
          @dateChanged="orderLogsInit"
        ></select-date>
        <div class="oneday-note" v-if="serviceOrder.note && role !== '2'">
          <div class="note-detail p10 font12">{{ serviceOrder.note }}</div>
        </div>
      </div>
      <!-- 微信用户可见的护理日志 role===2 -->
      <template v-if="role === '2'">
        <log-wechat :serviceOrder="serviceOrder" :key='timerKey'></log-wechat>
      </template>
      <!-- 我要管家APP端可见的护理日志（传统） -->
      <!-- 新增照片墙 -->
      <template v-else>
      <div  class="mt10 bg-white uploadImageText" v-if="serviceOrder.imgList.length>0">
        <p class="pb10">照片上传</p>
        <my-imagegallery
          :data="serviceOrder.imgList"
          :imagegalleryIndex="'imagegallery'"
          :id="serviceOrder.id"
          :deleteFlag="isToday">
        </my-imagegallery>
      </div>
        <service-list
          ref="list"
          :serviceOrder="serviceOrder"
          :addService="
            serviceOrder.addOrderServiceLogs
              ? serviceOrder.addOrderServiceLogs[0]
              : null
          "
          :role="role"
          @updated="updated"
          @mounted="updated"
        ></service-list>
        <evaluate
          v-if="serviceOrder.userSatisfaction"
          :serviceId="serviceOrder.id"
          :userSatisfaction="serviceOrder.userSatisfaction"
        ></evaluate>
      </template>
      <!-- 按钮区域 -->
      <div class="footer center" v-if="role === '4' || role === '6' || role === '8'">
        <mt-button
          v-if="compareDate(serviceOrder.selectTime, new Date().getTime())"
          size="large"
          class="my-btn btn-refund"
          @click="remarkPopupVisible = true"
          type="primary"
          >备注说明</mt-button
        >
      </div>
      <!-- <div
      class="mb15 font12 center text-grey"
      :class="footClass"
      v-if="role === '2'&& serviceOrder && serviceOrder.companyPicTelephone"
    >
      如有异议请联系
      <a :href="'tel:'+serviceOrder.companyPicTelephone">{{serviceOrder.companyPicTelephone}}</a>
    </div> -->
      <remark-popup
        :visible.sync="remarkPopupVisible"
        :workOrderId="serviceOrder.id"
        @remarkOk="remarkOk"
        :propnote="serviceOrder.note"
        used="workServiceNote"
      ></remark-popup>
    </template>
  </div>
</template>

<script>
import utils from '@/utils/myUtils'
import { workOrderApi } from '@/assets/api'
import remarkPopup from '../remarkPopup'
import serviceList from '../serviceList'
import selectDate from './selectDate'
import evaluate from './evaluate'
import logWechat from './serviceLogWechat'
export default {
  name: 'serviceLog',
  data () {
    return {
      remarkPopupVisible: false,
      role: utils.getItem('role'),
      orderId: this.$route.query.orderId || -1,
      serviceOrder: null,
      serviceDates: [],
      dateIndex: -1,
      bodyHeight: -1,
      screenHeight: document.documentElement.clientHeight,
      isFromWechat: 0,
      isToday: false
    }
  },
  created () {
    this.isFromWechat = this.$route.query.fromWechat === '1'
    console.log('isFromWechat', this.isFromWechat)
    const startTime = this.$route.query.time || new Date().getTime()
    this.orderLogsInit(startTime)
  },
  computed: {
    footClass () {
      return [
        {
          tel: this.screenHeight > this.bodyHeight + 31
        }
      ]
    }
  },

  components: { remarkPopup, serviceList, selectDate, logWechat, evaluate },
  methods: {
    updated () {
      let headerHeight = 36
      let contentHeight = this.$refs.content.offsetHeight
      this.bodyHeight = headerHeight + contentHeight
    },
    orderLogsInit (startTime) {
      if (!this.$store.state.submit) {
        return
      }
      this.$Indicator.open()
      this.$store.commit('setSubmit', false)
      this.timerKey = new Date().getTime()
      workOrderApi
        .getOrderLogs(this.orderId, startTime)
        .then((resp) => {
          this.serviceOrder = resp.data.data
          this.isToday = this.compareDate(this.serviceOrder.selectTime, new Date().getTime())
          if (!this.serviceOrder.note) {
            this.serviceOrder.note = ''
          }
        })
        .catch((e) => {
          this.$MessageBox.alert(e.data.errmsg).then(() => {
            this.$router.go(-1)
          })
        })
        .finally(() => {
          this.$Indicator.close()
          this.$store.commit('setSubmit', true)
        })
    },
    timeFormat (time) {
      return new Date(time).Format('MM月dd日')
    },
    compareDate (time1, time2) {
      return this.timeFormat(time1) === this.timeFormat(time2)
    },
    remarkOk (data) {
      this.$store.state.refreshNext.serviceTrack = true
      this.serviceOrder.note = data.note
    }
  }
}
</script>
<style lang="less" scoped>
.serviceLog {
  .oneday-note {
    padding: 10px 15px;
    background-color: @color-white;
    .note-detail {
      box-sizing: border-box;
      background-color: rgba(197, 208, 224, 0.15);
      color: rgba(62, 66, 85, 1);
    }
    &::before {
      content: '';
      border-top: 0.5px solid @border-color;
      position: absolute;
      top: 42px;
      left: 0;
      width: 100%;
      transform: scaleY(0.5);
    }
  }
  .uploadImageText{
    padding: 20px 15px 10px 15px;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
    }
    .btn-refund {
      color: rgba(141, 146, 158, 1);
      background-color: @background-white;
      border-top: 1px solid #f8f8f8;
    }
  }
  .tel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
