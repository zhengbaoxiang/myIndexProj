<template>
  <div class="dataSum bg-white myFont-DINPro-Medium">
    <h3 class="mint-cell font18 p15">数据总览</h3>
    <div class="dataSelect ptb10 plr15">
      <my-radiogroup
          :options="DateOptions"
          v-model="defaultOption"
          @change="optionChange"
          class="fl"
        ></my-radiogroup>
      <div class="datecontain font18 fr rel">
        <i class="past" @click.stop="dateChange(-1)"
          :class="compareDate(dateText,firstOrderTime)? 'text-grey': 'text-green' "
          > &lt; </i>
        <span class="datetextShow">{{dateText}}</span>
        <i class="future" @click.stop="dateChange(1)"
          :class="compareDate(dateText,nowDate)? 'text-grey': 'text-green' "
          > &gt; </i>
      </div>
      </div>
    <ul class="numbers p15">
      <li v-for="(item,index) in dataSum"  :key="index" :class="{mt20:index>0}">
        <div class="title rel">
           <i class="icon" :class=" 'icon_'+item.category "></i>
          <span class="pl30 font16">{{item.title}}</span>
        </div>
        <div class="detail pt20">
          <div v-for="(subitem,index) in item.detail" :key="index">
            <div class="subtitle">{{ subitem.title }}</div>
            <div class="count rel" :class="{ borderR: index<item.detail.length-1}">{{ subitem.value }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { dashBoardApi } from '@/assets/api'

export default {
  data () {
    return {
      DateOptions: [{ label: '年', value: 'year' }, { label: '月', value: 'mon' }],
      defaultOption: 'mon',
      dimension: 3, // 1（年），2（月），3（日）
      dataSum: [ ],
      firstOrderTime: '', // 接口返回的数据起始时间
      nowDate: '', // 当前时间
      dateText: '2020-05' // 显示的文本字段，表示当前数据的所属，

    }
  },
  created () {
    // 初始时显示为当前时间月
    this.nowDate = new Date().getTime()
    this.dateText = this.timeFormat(this.nowDate, 'yyyy-MM')
    this.getData(this.dateText)
  },
  mounted () {
  },
  watch: { },
  methods: {
    getData (date) {
      // beginDate=2020-05-01&endDate=2020-09-22&dimension=2
      let params = {}
      if (this.dimension === 1) {
        // 以年为单位时，date为 '2020'
        params = {
          beginDate: date + '-01',
          endDate: date + '-12',
          dimension: this.dimension
        }
      } else {
        // 当前月为3，其它月为2
        params = {
          beginDate: date,
          endDate: date,
          dimension: this.dimension
        }
      }
      dashBoardApi.getOverview(params).then((resp) => {
        const data = resp.data.data
        this.firstOrderTime = data.firstOrderTime
        console.log('firstOrderTime:', this.timeFormat(this.firstOrderTime, 'yyyy-MM-dd-hh:mm'))
        this.dataSum = this.initData(data, this.dimension)
      })
    },
    initData (result, dim) {
      let list, TITLEARG
      if (dim === 1) {
        list = [result.year, result.total]
        TITLEARG = ['当年', '累计']
      } else if (dim === 2) {
        list = [result.month, result.total]
        TITLEARG = ['当月', '累计']
      } else {
        list = [result.today, result.month, result.total]
        TITLEARG = ['今日', '当月', '累计']
      }

      const income = list.map((item, index) => {
        const isLarge = item.income > 1000000
        return {
          title: TITLEARG[index] + '营收' + (isLarge ? '(万元)' : '(元)'),
          value: this.numberFormat((item.income / (isLarge ? 1000000 : 100)).toFixed(2))
        }
      })
      const orderNum = list.map((item, index) => {
        return {
          title: TITLEARG[index] + (TITLEARG[index] === '今日' ? '新增(个)' : '订单(个)'),
          value: this.numberFormat(item.orderNum)
        }
      })
      const patientNum = list.map((item, index) => {
        return {
          title: TITLEARG[index] + '服务(人)',
          value: this.numberFormat(item.patientNum)
        }
      })

      const template = [
        {
          title: '订单数量',
          category: 'order',
          detail: orderNum
        },
        {
          title: '营收金额',
          category: 'money',
          detail: income
        },
        {
          title: '服务人次',
          category: 'peop',
          detail: patientNum
        }
      ]
      console.log('数据总览：', template)
      return template
    },
    optionChange (val) {
      console.log('切换年/月时重新调接口', val)
      this.dimension = (val === 'mon') ? 3 : 1
      this.dateText = (val === 'mon') ? this.timeFormat(this.nowDate, 'yyyy-MM') : this.timeFormat(this.nowDate, 'yyyy')
      this.getData(this.dateText)
    },
    dateChange (val) {
      const timeFormatStr = this.dimension === 1 ? 'yyyy' : 'yyyy-MM'
      const startdate = this.timeFormat(this.firstOrderTime, timeFormatStr)
      const curdate = this.timeFormat(this.nowDate, timeFormatStr)
      // 增减一年/一个月
      if (val === -1 && this.dateText !== startdate) {
        this.dateText = this.dimension === 1 ? Number(this.dateText) - 1 : this.getNewMonth(this.dateText, -1)
      } else if (val === 1 && this.dateText !== curdate) {
        this.dateText = this.dimension === 1 ? Number(this.dateText) + 1 : this.getNewMonth(this.dateText, 1)
      } else {
        return
      }
      this.dateText = String(this.dateText)
      this.dimension = this.dateText === this.timeFormat(this.nowDate, 'yyyy-MM') ? 3 : timeFormatStr === 'yyyy-MM' ? 2 : 1
      this.getData(this.dateText)
    },
    compareDate (date1, date2) {
      const year = this.timeFormat(date2, 'yyyy')
      const yearMon = this.timeFormat(date2, 'yyyy-MM')
      return this.dimension === 1 ? year === date1 : yearMon === date1
    },
    getNewMonth (date, val) {
      var arr = date.split('-')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var year2 = year
      var month2 = parseInt(month) + val
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      } else if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      month2 = ('' + month2).padStart(2, '0')
      return year2 + '-' + month2
    },
    timeFormat (time, formatStr = 'yyyy-MM-dd') {
      // 'yyyy年MM月dd日hh时mm分ss秒'
      return new Date(time).Format(formatStr)
    },
    // 千分位
    numberFormat (num) {
      const str = Number(num).toLocaleString()
      return str
    }
  }
}
</script>4
<style lang="less">
.dataSum{
  .dataSelect{
    box-sizing: border-box;
    height: 44px;
    .my-radiogroup-label{
      margin-right: 10px;
      display: inline-block;
      padding: 0 5px;
      height: 22px;
      line-height: 22px;
      border-radius: 1px;
      border: 1px solid #1FC1C9;
      background-color: transparent;
      color: #1FC1C9;
      font-size: 14px;
    }
    .mint-radio-input:checked + .my-radiogroup-label {
      color: #ffffff;
      background-color: #1fc1c9;
    }
    .datecontain{

      .datetextShow{
        display: inline-block;
        width: 100px;
        height: 23px;
        line-height: 23px;
        padding: 0 20px;
        color: rgba(74, 74, 74, 100);
        font-size: 18px;
        text-align: center;
      }
    }
  }
  .numbers{
    .title{
      color: rgba(74, 74, 74, 100);
      .icon{
        display: inline-block;
        width: 18px;
        height: 18px;
        position: absolute;
        top: 1px;
        background-size: contain
      }
      .icon_order{
        background-image: url('../../../assets/imgs/dataStats/icon_order@2x.png');
      }
      .icon_money{
        background-image:url('../../../assets/imgs/dataStats/icon_money@2x.png');
      }
      .icon_peop{
        background-image:url('../../../assets/imgs/dataStats/icon_peop@2x.png');
      }

    }
    .detail{
      display: flex;
      &>div{
        flex: 1;
        text-align: center;
        .subtitle{
          color: rgba(141, 146, 158, 100);
          font-size: 14px;
        }
        .count{
          font-size: 20px;
          text-align: center;
          padding: 5px;
          color: rgba(74, 74, 74, 100)
        }
        .borderR::before {
          content: '';
          position: absolute;
          right: 0;
          top: -5px;
          height: 30px;
          border-right: 1px solid #c1c3c7;
        }
      }

    }

  }

}

</style>
