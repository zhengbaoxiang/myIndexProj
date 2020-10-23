<template>
  <div class="selectDate ptb10">
    <span
      class="yestoday"
      :class="compareDate(startTime,sTime)? 'text-grey': 'text-default' "
      @click="selectDate(-1)"
    >前一天</span>
    <div class="middle">
      <div
        style="margin:auto"
        @click="getStartTimes"
      >
        <span class="fl">
          <img
            class="calendar"
            src="../../../assets/imgs/calendar.png"
          />
        </span>
        <span class="today">{{timeFormat(startTime)}}</span>
      </div>
    </div>
    <span
      class="tomorrow"
      :class="compareDate(startTime,eTime)? 'text-grey': 'text-default' "
      @click="selectDate(1)"
    >后一天</span>

    <!-- 服务开始时间弹窗 -->
    <my-actionsheet
      title="请选择开始时间"
      v-model="starttime.sheetVisible"
      :data="starttime.sheetList"
      @change="starttimeSelected"
    ></my-actionsheet>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startTime: -1,
      sTime: -1,
      eTime: -1,
      firstTime: -1,
      starttime: {
        sheetList: [],
        sheetVisible: false
      }
    }
  },
  props: {
    serviceOrder: {
      default: null
    }
  },
  created () {
    // this.startTime = this.$route.query.time || new Date().getTime()

    this.serviceDates = this.serviceOrder.serviceDates
    console.log(this.serviceDates)

    // 查询时间，如果今天有数据就是今天，如果没有就是前一天
    this.startTime = this.serviceOrder.selectTime
    this.sTime = this.serviceDates[0]
    console.log('开始时间是：' + new Date(this.sTime).Format('MM月dd日'))
    // 判断结束时间
    if (this.eTime === -1) {
      this.firstTime = this.serviceOrder.selectTime
      this.eTime = Math.min(
        this.serviceDates[this.serviceDates.length - 1],
        this.startTime
      )
      console.log('结束时间是：' + new Date(this.eTime).Format('MM月dd日'))
    }
  },
  watch: {
    startTime: {
      immediate: true,
      handler (startTime) {
        if (startTime > 0) {
          this.$emit('dateChanged', startTime)
          //   this.orderLogsInit()
        }
      }
    }
  },
  methods: {
    // 处理从第一天开始的服务天数
    getStartTimes () {
      let dateList = []
      this.serviceDates.forEach((item) => {
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

    timeFormat (time) {
      return new Date(time).Format('MM月dd日')
    },
    compareDate (time1, time2) {
      return this.timeFormat(time1) === this.timeFormat(time2)
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
    }
  }
}
</script>
<style lang="less" scoped>
.selectDate {
  height: 42px;
  box-sizing: border-box;
  background-color: @color-white;
  display: flex;
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
}
</style>
