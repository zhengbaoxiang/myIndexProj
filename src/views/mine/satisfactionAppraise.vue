<template>
  <div class="satisfactionAppraise" v-if="appraiseInfo || noAppraiseInfo || !getData">
    <my-header title="满意度评价"></my-header>
    <div>
      <div v-show="getData" class="date ptb10">
        <span
          class="yestoday"
          :class="compareDate(startTime,sTime)? 'text-grey': 'text-default' "
          @click="selectDate(-1)"
        >前一月</span>
        <div class="middle">
          <div style="margin:auto" @click="getStartTimes">
            <span class="fl">
              <img class="calendar" src="../../assets/imgs/calendar.png" />
            </span>
            <span class="today">{{timeDate}}</span>
          </div>
        </div>
        <span
          class="tomorrow"
          :class="compareDate(startTime,new Date().getTime())? 'text-grey': 'text-default' "
          @click="selectDate(1)"
        >后一月</span>
      </div>
      <div v-show="!this.noAppraiseInfo && getData" class="total-appraise">
        <div class="center font16">总体评价</div>
        <ul class="rate">
          <li v-for="(star, i) in stars1" :key="i">
            <i
              :class="['myicon star', {'fill' : star}]"
              @click="compareDate(startTime,new Date().getTime()) && setStar(i,1)"
            ></i>
          </li>
        </ul>
        <div class>
          <textarea
            placeholder="请对本月的护工做出评价哦"
            class="mint-field-core appraise-content"
            maxlength="200"
            rows="4"
            v-model="appraise"
            @input="filterNote(appraise)"
            @blur="restore"
            :disabled="!compareDate(startTime,new Date().getTime())"
          ></textarea>
        </div>
      </div>

      <div v-show="this.noAppraiseInfo && getData " class="noOrders center">
        <img src="../../assets/imgs/noOrders.png" alt />
        <div class="word">本月无评价</div>
      </div>
      <div v-show="!getData " class="noOrders center">
        <img src="../../assets/imgs/noOrders.png" alt />
        <div class="word">{{role==='6' ? '该护士长无评价' : '该运维管家无评价'}}</div>
      </div>
    </div>
    <div v-show="!this.noAppraiseInfo && getData" class="mt10 bg-white">
      <mt-cell title="护工评价">
        <slot name="right">
          <input
            class="right font12"
            value="满意请给五星好评哦"
            readonly
            unselectable="on"
            onfocus="this.blur()"
          />
        </slot>
      </mt-cell>
      <div class="detail-appraise">
        <div class="single pb15">
          <span class="font14">服务态度</span>
          <ul class="single-rate">
            <li v-for="(star, i) in stars2" :key="i">
              <i
                :class="['myicon-small star', {'fill' : star}]"
                @click="compareDate(startTime,new Date().getTime()) && setStar(i,2)"
              ></i>
            </li>
          </ul>
        </div>
        <div class="single pb15">
          <span class="font14">护理技能</span>
          <ul class="single-rate">
            <li v-for="(star, i) in stars3" :key="i">
              <i
                :class="['myicon-small star', {'fill' : star}]"
                @click="compareDate(startTime,new Date().getTime()) && setStar(i,3)"
              ></i>
            </li>
          </ul>
        </div>
        <div class="single pb15">
          <span class="font14">仪容举止</span>
          <ul class="single-rate">
            <li v-for="(star, i) in stars4" :key="i">
              <i
                :class="['myicon-small star', {'fill' : star}]"
                @click="compareDate(startTime,new Date().getTime()) && setStar(i,4)"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom fixed">
      <mt-button
        v-if="compareDate(startTime,new Date().getTime()) && !this.noAppraiseInfo && getData"
        type="primary"
        size="large"
        @click="submit"
      >提交</mt-button>
    </div>

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
import { mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'
export default {
  name: 'satisfactionAppraise',
  data () {
    return {
      role: utils.getItem('role'),
      stars1: [true, true, true, true, true],
      stars2: [true, true, true, true, true],
      stars3: [true, true, true, true, true],
      stars4: [true, true, true, true, true],
      appraise: '',
      startTime: -1, // 查询/提交评价的年月
      timeDate: null,
      sTime: -1,
      eTime: -1,
      starttime: {
        sheetList: [],
        sheetVisible: false
      },
      dateNumber: -1,
      appraiseInfo: null,
      appraiseId: 0,
      noAppraiseInfo: null,
      getData: true
    }
  },
  created () {
    this.startTime = new Date().getTime()
    this.timeDate = this.timeFormat(this.startTime)
  },

  watch: {
    timeDate: {
      immediate: true,
      handler (timeDate) {
        if (timeDate) this.appraiseInit()
      }
    }
  },
  computed: {
    noteTips () {
      if (utils.trim(this.appraise) === '') {
        return '请填写评语后提交'
      } else return false
    }
  },
  components: {},
  methods: {
    appraiseInit () {
      if (!this.$store.state.submit) {
        return
      }
      this.$Indicator.open()
      this.$store.commit('setSubmit', false)
      mineApi
        .getEvaluate(this.startTime)
        .then(resp => {
          this.noAppraiseInfo = null
          this.appraiseInfo = resp.data.data
          this.appraiseId = this.appraiseInfo.id
          this.startTime = this.appraiseInfo.evaluateDate
          this.timeDate = this.timeFormat(this.startTime)
          if (this.sTime === -1) {
            this.sTime = this.appraiseInfo.evaluateStartTime
            this.eTime = this.appraiseInfo.evaluateEndTime
          }
          this.dateNumber = this.getIntervalMonth(
            new Date(this.sTime),
            new Date()
          )
          this.dateNumber = this.dateNumber >= 6 ? 6 : this.dateNumber + 1
          this.isSixMonth()
          // 回显分数
          if (!this.appraiseInfo.evaluate1) {
            this.appraiseInfo.evaluate1 = 5
          }
          if (!this.appraiseInfo.evaluate2) {
            this.appraiseInfo.evaluate2 = 5
          }
          if (!this.appraiseInfo.evaluate3) {
            this.appraiseInfo.evaluate3 = 5
          }
          if (!this.appraiseInfo.evaluate4) {
            this.appraiseInfo.evaluate4 = 5
          }

          this.stars1 = this.stars1.map((star, index) => {
            return this.appraiseInfo.evaluate1 - 1 >= index
          })
          this.stars2 = this.stars2.map((star, index) => {
            return this.appraiseInfo.evaluate2 - 1 >= index
          })

          this.stars3 = this.stars3.map((star, index) => {
            return this.appraiseInfo.evaluate3 - 1 >= index
          })

          //  this.start3 = this.start3.map((start, index) => {
          //   return (
          //     (this.appraiseInfo.evaluate3 ? this.appraiseInfo.evaluate3 : 5) - 1 >= index);
          // });

          this.stars4 = this.stars4.map((star, index) => {
            return this.appraiseInfo.evaluate4 - 1 >= index
          })
          // 回显评价内容
          this.appraise = this.appraiseInfo.evaluate || ''
        })
        .catch(e => {
          if (e.data.errcode === '5002') {
            this.noAppraiseInfo = e.data.data
            this.startTime = this.noAppraiseInfo.evaluateDate
            this.timeDate = this.timeFormat(this.startTime)
            if (this.sTime === -1) {
              this.sTime = this.noAppraiseInfo.evaluateStartTime
              this.eTime = this.noAppraiseInfo.evaluateEndTime
            }

            this.dateNumber = this.getIntervalMonth(
              new Date(this.sTime),
              new Date()
            )
            this.dateNumber = this.dateNumber >= 6 ? 6 : this.dateNumber + 1
            this.isSixMonth()
          }
          if (e.data.errcode === '5003') {
            this.getData = false
          }
        })

        .finally(() => {
          this.$Indicator.close()
          this.$store.commit('setSubmit', true)
        })
    },
    // 判断是否相差6个月,如果相差大于6个月，改变开始时间为6个月前
    isSixMonth () {
      if (this.dateNumber >= 6) {
        let data = new Date(this.startTime)
        data.setMonth(data.getMonth() - 5, 1)
        let m = data.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let temp = data.getFullYear() + '年' + m + '月'
        this.sTime = new Date(data.getFullYear(), m - 1).getTime()
        console.log('开始时间大于6个月，改变开始时间为-----六个月前' + temp)
      }
    },
    setStar (i, val) {
      switch (val) {
        case 1:
          this.stars1 = this.stars1.map((star, index) => {
            return i >= index
          })
          break
        case 2:
          this.stars2 = this.stars2.map((star, index) => {
            return i >= index
          })
          break
        case 3:
          this.stars3 = this.stars3.map((star, index) => {
            return i >= index
          })
          break
        case 4:
          this.stars4 = this.stars4.map((star, index) => {
            return i >= index
          })
          break
      }
    },
    // 选中的开始服务时间
    starttimeSelected (val) {
      const year = val[0].substr(0, 4)
      const month = val[0].substr(5, 2)
      this.startTime = new Date(year, month - 1).getTime()
      this.timeDate = this.timeFormat(this.startTime)
    },
    // 获取当前时间与开始有评价时相差的月份
    getIntervalMonth (startDate, currentDate) {
      let startMonth = startDate.getMonth()
      let currentMonth = currentDate.getMonth()
      let intervalMonth =
        currentDate.getFullYear() * 12 +
        currentMonth -
        (startDate.getFullYear() * 12 + startMonth)
      return intervalMonth
    },

    //  弹出框数据
    getStartTimes () {
      console.log('判断之后获取列表月份数：' + this.dateNumber)
      let dateList = []
      let data = new Date()
      data.setMonth(data.getMonth() + 1, 1) // 获取到当前月份,设置月份
      for (var i = 0; i < this.dateNumber; i++) {
        data.setMonth(data.getMonth() - 1) // 每次循环一次 月份值减1
        var m = data.getMonth() + 1
        m = m < 10 ? '0' + m : m
        dateList.push(data.getFullYear() + '年' + m + '月')
      }
      dateList = dateList.reverse()
      console.log(dateList)

      this.starttime.sheetList = [
        {
          flex: 1,
          values: dateList,
          defaultIndex: dateList.length - 1
        }
      ]
      this.starttime.sheetVisible = true
    },
    // 获取上一个月或下一个月
    selectDate (val) {
      let data = new Date(this.startTime)
      data.setMonth(data.getMonth() + val, 1) // 获取到当前月份,设置月份
      let m = data.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let selectDate = new Date(data.getFullYear(), m - 1).getTime()
      if (val === -1 && !this.compareDate(this.startTime, this.sTime)) {
        this.startTime = selectDate
        this.timeDate = this.timeFormat(this.startTime)
      } else if (
        val === 1 &&
        !this.compareDate(this.startTime, new Date().getTime())
      ) {
        this.startTime = selectDate
        this.timeDate = this.timeFormat(this.startTime)
      }
    },
    timeFormat (time) {
      return new Date(time).Format('yyyy年MM月')
    },
    compareDate (time1, time2) {
      return this.timeFormat(time1) === this.timeFormat(time2)
    },
    // 提交评价
    submit () {
      // 评语必填
      if (this.noteTips) {
        this.$MessageBox.alert(this.noteTips)
        return
      }
      // 防重点击
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      const arg = {
        id: this.appraiseId,
        evaluate1: this.stars1.lastIndexOf(true) + 1,
        evaluate2: this.stars2.lastIndexOf(true) + 1,
        evaluate3: this.stars3.lastIndexOf(true) + 1,
        evaluate4: this.stars4.lastIndexOf(true) + 1,
        evaluate: this.appraise,
        evaluateDate: this.startTime
      }
      mineApi
        .postEvaluate(arg)
        .then(e => {
          this.$MessageBox.alert('评价成功!').then(action => {
            this.goHistory()
          })
        })
        .catch(e => {
          if (e.data) {
            this.$MessageBox.alert(e.data.errmsg)
          } else {
            this.$MessageBox.alert('评价失败，请稍后再试!')
          }
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    filterNote (appraise) {
      this.appraise = utils.filterEmoji(appraise)
    }
  }
}
</script>
<style lang="less" type="text/less">
.satisfactionAppraise {
  textarea:disabled {
    background-color: @background-white;
  }
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
  .total-appraise {
    box-sizing: border-box;
    padding: @m15;
    background-color: @color-white;
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
  .rate {
    padding: 10px 10px 15px;
    text-align: center;
    li {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .single-rate {
    float: right;
    li {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .appraise-content {
    width: 100%;
    height: 120px;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 1px;
    box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
    border: 0.5px solid rgba(236, 236, 243, 1);
    font-size: 16px;
  }
  .detail-appraise {
    padding: @m15 @m15 0 @m15;
  }
  .noOrders {
    margin-top: 178px;
    img {
      width: 50%;
      max-width: 378px;
    }
    .word {
      padding-top: @m15;
      color: rgba(141, 146, 158, 0.5);
    }
  }
}
</style>
