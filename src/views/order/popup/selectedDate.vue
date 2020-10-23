<template>
  <div>
    <mt-popup v-show="currentValue" class="selectdate-title" position="bottom">
      <div class="options">
        <a class="my-selectdate-button left" @click="currentValue=false">取消</a>
        <a class="my-selectdate-title">{{title}}</a>
        <a class="my-selectdate-button right" @click="ok">确定</a>
        <ul class="title">
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
      </div>
    </mt-popup>
    <mt-popup v-show="currentValue" class="my-selectdate" position="bottom">
      <div v-if="dayList">
        <ul class="dates" v-for="(month,index) in dayList" :key="index">
          <li
            class="months"
            :class="{'isFixedTop':month.isFixedTop}"
            :style="{'top':topHeight+'px'}"
          >{{month.title}}</li>
          <ul class="days" :class="{'isFixedbottom':month.isFixedTop}">
            <!-- 前方空白框 -->
            <label class="mint-checklist-label" v-for="blank in month.blank" :key="month + blank">
              <div class="mint-checkbox-label"></div>
            </label>
            <label
              class="mint-checklist-label"
              :class="{'bgColor-view-selected' :pattern=== 'view' && selectedList.includes(day.time) && !refundList.includes(day.time),
                       'bgColor-view-refund'   :pattern=== 'view' && refundList.includes(day.time),
                       'bgColor-view-old'      :pattern=== 'order' && originDates.includes(day.time) && !selectedList.includes(day.time) }
                       "
              v-for="(day ,dayindex) in month.days"
              :key="dayindex"
            >
              <!-- 日期上部选择几天的小标签 -->
              <mt-badge
                class="order"
                v-if="selectedList.length > 0 && day.orderShow &&  pattern !== 'view' && selectedmaxLimit !== 1"
                size="small"
              >
                {{ pattern=== 'order'? (
                originDates && originDates.length > 0 ?
                '续'+selectedList.length + '天'
                :'共'+selectedList.length + '天')
                : ('剩' +(selectedList.length - refundList.length )+ '天')}}
              </mt-badge>
              <!-- 退几天的标签 -->
              <mt-badge
                class="order"
                v-if="refundList.length > 0 && day.refundShow && refundList.includes(day.time)"
                size="small"
              >{{ '退'+refundList.length +'天'}}</mt-badge>
              <!-- 下单数组selectedList的<input> -->
              <input
                v-if="pattern=== 'order' && day.time && !originDates.includes(day.time)
                && !(originDates.length > 0 && (day.time <originDates[originDates.length-1]
                                      || day.time < (new Date().getTime() -24*60*60*1000)))"
                type="checkbox"
                class="mint-checkbox-input bgColor-order"
                :value="day.time"
                v-model="selectedList"
              />
              <!-- 退款refundList的<input> -->
              <input
                v-if="pattern=== 'refund' && day.time &&  selectedList.includes(day.time) "
                type="checkbox"
                class="mint-checkbox-input bgColor-refund"
                :value="day.time"
                v-model="refundList"
              />
              <!-- 日期数字 -->
              <div
                :class="['mint-checkbox-label',(pattern=== 'order' &&  day.time) || pattern=== 'view'  ? '' : 'text-grey']"
              >{{day.day}}</div>
            </label>
          </ul>
        </ul>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import Popup from 'mint-ui/src/utils/popup'
export default {
  name: 'my-selectdate',
  mixins: [Popup],
  data () {
    return {
      currentValue: false,
      selectedList: [],
      refundList: [],
      startTime: null,
      dayIndex: 180, // 展示天数
      monthIndex: 7, // 展示月份
      dayList: null,
      days: [],
      orderMax: 0, // 记录选中的数组中最大的日期,并展示该日期上方的 '共/续几天'的标签
      refundMax: 0, // 记录退款数组中最大的日期,并展示该日期上方的 '退几天'的标签
      topHeight: 0
    }
  },
  props: {
    modal: {
      default: true
    },
    selectedmaxLimit: {
      default: 0
    }, // 下单的天数的最大限制, = 0 时为无限制
    pattern: {
      default: ''
    }, // 模式设置,分为三种:下单(order),查看(view),退款(refund)
    data: {
      type: Array,
      default: () => []
    },
    refundData: {
      type: Array,
      default: () => []
    }, // 选择退款日期的数组
    originDates: {
      type: Array,
      default: () => []
    }, // 再来一单时传递该数组
    title: {
      type: String,
      default: '请选择'
    }
  },
  watch: {
    originDates (val) {
      // 再来一单时传递该数组
      if (this.pattern === 'order' && val) {
        // 2.编辑订单模式
        if (this.startTime > val[0]) {
          this.startTime = val[0]
          this.dateInit()
        }
      }
    },
    data (val) {
      console.log('valval', val)
      if (this.pattern === 'refund') {
        // 1.退款模式
        if (this.startTime > val[val.length - 1]) {
          this.startTime = val[0]
          this.selectedList = val
        } else if (
          this.startTime > val[0] &&
          this.startTime <= val[val.length - 1]
        ) {
          let _this = this
          this.selectedList = val.filter(function (number) {
            return number >= _this.startTime
          })
        } else {
          this.selectedList = val
        }
      } else if (this.pattern === 'order' && val) {
        // 2.编辑订单模式
        if (this.startTime > val[0]) {
          this.startTime = val[0]
        }
        this.selectedList = val
      } else {
        this.selectedList = val
      }
      this.dateInit()
    },
    currentValue (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.currentValue = val
    },
    selectedList (val, old) {
      console.log('val.length', val.length)
      console.log('old.length', old.length)
      console.log('this.selectedmaxLimit', this.selectedmaxLimit)
      if (this.selectedmaxLimit > 0 && val.length > this.selectedmaxLimit) {
        this.selectedList.splice(0, 1)
        return
      }
      let max = Math.max.apply(null, val)
      let _this = this
      if (max !== this.orderMax) {
        this.days.filter(function (value, index) {
          if (value.time === _this.orderMax) {
            value.orderShow = false
          }
          if (value.time === max) {
            value.orderShow = true
          }
        })
        //
        this.orderMax = max
      }
    },
    refundList (val) {
      console.log('refundList', val)
      let max = Math.max.apply(null, val)
      let _this = this
      if (max !== this.refundMax) {
        this.days.filter(function (value, index) {
          if (value.time === _this.refundMax) {
            value.refundShow = false
          }
          if (value.time === max) {
            value.refundShow = true
          }
        })
        this.refundMax = max
      }
    }
  },
  mounted () {
    this.topHeight =
      (document.documentElement.clientHeight || document.body.clientHeight) *
        0.2 +
      82
    this.selectedList = this.data
    this.refundList = this.refundData
    console.log('mountedrefundList', this.refundList)
    if (this.selectedList.length > 0) {
      this.startTime = Math.min(this.startTime, this.selectedList[0])
    }
    if (this.originDates.length > 0) {
      this.startTime = Math.min(this.startTime, this.originDates[0])
    }
    console.log('startTime', this.startTime)
    console.log('selectedList[0]', this.selectedList[0])
    this.dateInit()
    window.addEventListener('scroll', this.dateHandleScroll, true)
    window.addEventListener('touchmove', this.dateHandleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.dateHandleScroll, true)
    window.removeEventListener('touchmove', this.dateHandleScroll)
  },
  created () {
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    this.startTime = date.getTime()
    if (this.selectedList.length > 0) {
      this.startTime = Math.min(date.getTime(), this.selectedList[0])
    }
    if (this.originDates.length > 0) {
      this.startTime = Math.min(this.startTime, this.originDates[0])
    }
  },
  methods: {
    dateHandleScroll (e) {
      let height = Math.ceil(this.topHeight)
      var alldays = document.querySelectorAll('.days')
      this.dayList.forEach((m) => {
        m.isFixedTop = false
      })
      this.dayList.map((ele, i) => {
        ele.isFixedTop = false
        var contop = alldays[i].getBoundingClientRect().top - 32
        if (contop < height && contop > height - alldays[i].offsetHeight) {
          ele.isFixedTop = true
        }
        this.$set(this.dayList, i, ele)
      })
    },
    dateInit () {
      let dayList = []
      for (var i = 0; i < this.dayIndex; i++) {
        let currentDate = new Date(this.startTime + i * 24 * 60 * 60 * 1000)
        dayList.push({
          year: currentDate.Format('yyyy'),
          month: currentDate.Format('MM'),
          day: parseInt(currentDate.Format('dd')),
          time: currentDate.getTime(),
          refundshow: false,
          orderShow: false
        })
      }
      let ret = []
      for (let i = 0; i < this.monthIndex; i++) {
        ret.push({
          days: [],
          blank: 0,
          title: ''
        })
      }
      // 初始化首月开头位置
      ret[0].blank = 0
      let startDay = parseInt(new Date(this.startTime).Format('dd'))
      let index = new Date(this.startTime).getDay() // 星期几
      let date = new Date(this.startTime).getDate() // 几号
      console.log(date <= 7)
      console.log(index >= date)
      if (date < 7 && index >= date) {
        ret[0].blank = index - date + 1
        console.log(ret[0].blank)
      }
      console.log('index', index)
      console.log('date', date)
      console.log('startDay', startDay)
      for (let i = index; i >= 1; i--) {
        if (date - i > 0) {
          ret[0].days.push({
            day: startDay - i,
            refundshow: false,
            orderShow: false
          })
        }
      }
      let start = new Date(this.startTime).Format('MM')
      dayList.filter(function (value, index) {
        let order = parseInt(value.month) - parseInt(start)
        order = order >= 0 ? order : order + 12
        if (value.day === 1) {
          let _blank = parseInt(new Date(value.time).getDay())
          if (_blank === 7) _blank = 0
          ret[order].blank = _blank
        }
        if (index === 0 || value.day === 1) {
          ret[order].title = value.year + '年' + value.month + '月'
        }
        ret[order].days.push(value)
      })
      this.days = dayList
      this.dayList = ret
    },
    // 点击确定，emit事件。
    ok () {
      this.$emit('selectedDate', this.selectedList)
      this.$emit('refundDate', this.refundList)
      this.currentValue = false
    }
  }
}
</script>

<style lang="less">
.selectdate-title {
  top: 20%;
  transform: inherit;
  left: 0;
  // height: 82px;
  .my-selectdate-button {
    position: absolute;
    text-align: center;
    top: 0;
    display: block;
    height: 52px;
    line-height: 52px;
    font-size: 14px;
    // background-color: #fff;
    &:active {
      background-color: #f0f0f0;
    }
    &.left {
      left: 15px;
      color: @color-default;
    }
    &.right {
      right: 15px;
      color: @color-green;
    }
  }
  .my-selectdate-title {
    display: block;
    text-align: center;
    width: 100% - 120px;
    height: 52px;
    line-height: 52px;
    font-size: 16px;
    color: @color-default;
    background-color: #fff;
    box-shadow: inset 0px -0.5px 0px 0px rgba(0, 0, 0, 0.1);
  }
  .title {
    background-color: #f5f5fa;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    li {
      width: calc(100% / 7);
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
  }
  .options {
    position: absolute;
    width: 100%;
  }
}
.isFixedTop {
  position: fixed;
  left: 0;
  right: 0;
  // z-index: 2;
}
.isFixedbottom {
  margin-top: 32px;
}
.months {
  height: 32px;
  line-height: 32px;
  text-align: center;
  box-shadow: inset 0px -0.5px 0px 0px rgba(0, 0, 0, 0.1);
  background-color: white;
}
.my-selectdate {
  top: calc(20% + 82px);
  overflow: auto;
  transform: inherit;
  left: 0;
  .dates {
    .days {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      .mint-checklist-label {
        padding: 0;
      }
      .mint-checkbox-label {
        margin-left: 0;
      }
      .bgColor-view-old {
        background-color: rgba(31, 193, 201, 0.1);
        border-color: rgba(31, 193, 201, 0.1);
        color: #1fc1c9;
      }
      .bgColor-view-selected {
        background-color: #1fc1c9;
        border-color: #1fc1c9;
        color: white;
      }
      .bgColor-view-refund {
        background-color: rgba(31, 193, 201, 0.1);
        border-color: rgba(31, 193, 201, 0.1);
        color: #1fc1c9;
      }
      .bgColor-order:checked + .mint-checkbox-label {
        background-color: #1fc1c9;
        border-color: #1fc1c9;
        color: white;
      }
      .bgColor-refund + .mint-checkbox-label {
        background-color: rgba(31, 193, 201, 0.1);
        border-color: rgba(31, 193, 201, 0.1);
        color: #1fc1c9;
      }
      .bgColor-refund:checked + .mint-checkbox-label {
        background-color: #1fc1c9;
        border-color: #1fc1c9;
        color: white;
      }
      label {
        font-size: 14px;
        text-align: center;
        height: 53px;
        line-height: 53px;
        width: calc(100% / 7);
      }
    }
    .order {
      position: absolute;
      border-radius: 0;
      background-color: rgba(96, 111, 130, 0.6);
      color: white;
      padding: 2px 2.5px;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
      margin-top: -25px;
      margin-left: -20.5px;
      width: 41px;
      height: 16px;
      text-align: center;
    }
    .order:before {
      display: inline-block;
      width: 0;
      height: 0;
      border: solid transparent;
      border-width: 5px;
      border-top-color: rgba(96, 111, 130, 0.6);
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      margin-left: -5px;
    }
  }
}
</style>
