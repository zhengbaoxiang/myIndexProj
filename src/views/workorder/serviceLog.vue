<template>
  <div class="serviceLog" ref="content">
    <my-header title="护理日志"></my-header>
    <div
      ref="title"
      v-if="serviceOrder"
    >
      <div class="date ptb10">
        <span
          class="yestoday"
          :class="compareDate(startTime,sTime)? 'text-grey': 'text-default' "
          @click="selectDate(-1)"
        >前一天</span>
        <div class="middle">
          <div style="margin:auto" @click="getStartTimes">
            <span class="fl">
              <img class="calendar" src="../../assets/imgs/calendar.png" />
            </span>
            <span class="today">{{timeFormat(startTime)}}</span>
          </div>
        </div>
        <span
          class="tomorrow"
          :class="compareDate(startTime,eTime)? 'text-grey': 'text-default' "
          @click="selectDate(1)"
        >后一天</span>
      </div>
      <div class="oneday-note" v-if="serviceOrder && serviceOrder.note">
        <div class="note-detail p10 font12">{{serviceOrder.note}}</div>
      </div>
    </div>
    <service-list
      v-if="serviceOrder"
      ref="list"
      :serviceOrder="serviceOrder"
      :addService="serviceOrder.addOrderServiceLogs ? serviceOrder.addOrderServiceLogs[0] : null"
      :role="role"
      @updated="updated"
      @mounted="updated"
    ></service-list>
    <div class="footer center" v-if="serviceOrder && role === '4'">
      <mt-button
        v-if="compareDate(startTime,new Date().getTime())"
        size="large"
        class="my-btn btn-refund"
        @click="remarkPopupVisible = true"
        type="primary"
      >备注说明</mt-button>
    </div>
    <div
      class="mb15 font12 center text-grey"
      :class="footClass"
      v-if="role === '2'&& serviceOrder && serviceOrder.companyPicTelephone"
    >
      如有异议请联系
      <a :href="'tel:'+serviceOrder.companyPicTelephone">{{serviceOrder.companyPicTelephone}}</a>
    </div>
    <!-- 服务开始时间弹窗 -->
    <my-actionsheet
      title="请选择开始时间"
      v-model="starttime.sheetVisible"
      :data="starttime.sheetList"
      @change="starttimeSelected"
    ></my-actionsheet>
    <remark-popup
      v-if="serviceOrder"
      :visible.sync="remarkPopupVisible"
      :workOrderId="serviceOrder.id"
      @remarkOk="remarkOk"
      :propnote="serviceOrder.note"
      used="workServiceNote"
    ></remark-popup>
  </div>
</template>

<script>
import { workOrderApi } from '@/assets/api'
import remarkPopup from './remarkPopup'
import serviceList from './serviceList'
import utils from '@/utils/myUtils'
export default {
  name: 'serviceLog',
  data () {
    return {
      remarkPopupVisible: false,
      role: utils.getItem('role'),
      orderId: this.$route.query.orderId || -1,
      startTime: -1,
      sTime: -1,
      eTime: -1,
      firstTime: -1,
      starttime: {
        sheetList: [],
        sheetVisible: false
      },
      serviceOrder: null,
      serviceDates: [],
      dateIndex: -1,
      bodyHeight: -1,
      screenHeight: document.documentElement.clientHeight
    }
  },
  created () {
    this.startTime = this.$route.query.time || new Date().getTime()
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
  watch: {
    startTime: {
      immediate: true,
      handler (startTime) {
        if (startTime > 0) this.orderLogsInit()
      }
    }
  },
  components: { remarkPopup, serviceList },
  methods: {
    updated () {
      let headerHeight = 36
      let contentHeight = this.$refs.content.offsetHeight
      this.bodyHeight = headerHeight + contentHeight
    },
    orderLogsInit () {
      if (!this.$store.state.submit) {
        return
      }
      this.$Indicator.open()
      this.$store.commit('setSubmit', false)
      workOrderApi
        .getOrderLogs(this.orderId, this.startTime)
        .then(resp => {
          this.serviceOrder = resp.data.data
          this.serviceDates = this.serviceOrder.serviceDates
          if (!this.serviceOrder.note) {
            this.serviceOrder.note = ''
          }
          console.log(this.serviceDates)
          // 查询时间，如果今天有数据就是今天，如果没有就是前一天
          this.startTime = this.serviceOrder.selectTime
          this.sTime = this.serviceDates[0]
          console.log('开始时间是：' + this.sTime)
          // 判断结束时间
          if (this.eTime === -1) {
            this.firstTime = this.serviceOrder.selectTime
            this.eTime = Math.min(
              this.serviceDates[this.serviceDates.length - 1],
              this.startTime
            )
            console.log(
              '结束时间是：' + new Date(this.eTime).Format('MM月dd日')
            )
          }
        })
        .catch(e => {
          this.$MessageBox.alert(e.data.errmsg).then(() => {
            this.$router.go(-1)
          })
        })
        .finally(() => {
          this.$Indicator.close()
          this.$store.commit('setSubmit', true)
        })
    },
    // 选中的开始服务时间
    starttimeSelected (val) {
      const month = val[0].substr(0, 2)
      const day = val[0].substr(3, 2)
      this.startTime = new Date(
        new Date().getFullYear(),
        month - 1,
        day
      ).getTime()
      console.log('选中的服务天数：' + this.startTime)
    },
    // 处理从第一天开始的服务天数
    getStartTimes () {
      let dateList = []
      this.serviceDates.forEach(item => {
        if (item <= this.firstTime) {
          let singleDate = new Date(item).Format('MM月dd日')
          dateList.push(singleDate)
        }
      })
      let dateNum = dateList.length
      this.starttime.sheetList = [
        {
          flex: 1,
          values: dateList,
          defaultIndex: dateNum - 1
        }
      ]
      this.starttime.sheetVisible = true
    },
    selectDate (val) {
      console.log('前后一天选择：' + this.startTime)
      this.serviceDates.forEach((item, index) => {
        if (item === this.startTime) {
          this.dateIndex = index
        }
      })
      let lastIndex = this.dateIndex + val
      let selectDate = this.serviceDates[lastIndex]
      if (val === -1 && !this.compareDate(this.startTime, this.sTime)) {
        console.log('点击了前一天')
        this.startTime = selectDate
        console.log(
          '此时的查询时间为：' + new Date(this.startTime).Format('MM月dd日')
        )
      } else if (val === 1 && !this.compareDate(this.startTime, this.eTime)) {
        console.log('点击了后一天')
        this.startTime = selectDate
        console.log(
          '此时的查询时间为：' + new Date(this.startTime).Format('MM月dd日')
        )
      }
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
  .date {
    height: 42px;
    box-sizing: border-box;
    background-color: @color-white;
    display: flex;
  }
  .yestoday {
    width: 29%;
    text-align: center;
    border-right: 1px solid #eeeff1;
  }
  .middle {
    width: 41.86%;
    box-sizing: border-box;
    text-align: center;
    align-content: center;
    display: flex;
    .today {
      display: inline-block;
    }
    .calendar {
      display: inline-block;
      height: 15px;
      width: 15px;
      margin: 4px 11px 4px auto;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .tomorrow {
    width: 29%;
    text-align: center;
    border-left: 1px solid #eeeff1;
  }
  .oneday-note {
    padding: 10px 15px;
    background-color: @color-white;
    .note-detail {
      box-sizing: border-box;
      background-color: rgba(197, 208, 224, 0.15);
      color: rgba(62, 66, 85, 1);
    }
    &::before {
      content: "";
      border-top: 0.5px solid @border-color;
      position: absolute;
      top: 42px;
      left: 0;
      width: 100%;
      transform: scaleY(0.5);
    }
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
