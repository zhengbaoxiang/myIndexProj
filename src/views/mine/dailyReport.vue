<template>
  <div class="daily-report">
    <my-header title="每日简报"></my-header>
    <div class="date ptb10 center bg-white">
      <span
        :class="['front',timeText === sheetList[0] ? 'text-grey': 'text-default']"
        @click="timeText !== sheetList[0] && selectDate(-1)"
      >前一天</span>
      <div class="middle" @click="showSheet">
        <img src="../../assets/imgs/calendar.png" />
        <span>{{timeText}}</span>
      </div>
      <span
        :class="['behind',timeText === sheetList[sheetList.length - 1] ? 'text-grey': 'text-default']"
        @click="timeText !== sheetList[sheetList.length - 1] && selectDate(1)"
      >后一天</span>
    </div>
    <div v-if="districtList && districtList.length>0">
      <div class="reports" v-for="(district,index) in districtList" :key="index">
        <div
          class="title mb15"
        >{{(role==='7' ||role==='3')? district.campusName : district.districtName}}</div>
        <ul class="item" v-for="count in 4" :key="count" :ref="index+'scrollMonth'+count">
          <div :style="{'height':heightList[count-1]+'px'}">
            <div
              class="item-top"
              :class="{'tofixed-top': district.isFixedTop && district.isFixedTop[count-1] && getToggle(district,count) }"
              :style="bgStyle(count)"
            >
              <div class="font14 white-eight">{{titleText(count)}}</div>
              <div class="second mt15">
                <span class="font30 myFont-DINPro-Medium">{{numerValue(district.reports,count)}}</span>
                <div class="mint-badge my-badge ml10 bg-black">
                  <span>环比</span>
                  <span
                    :class="['myicon ml10' ,numerRatio(district.reports,count) >= 0 ?'top' : 'down']"
                  ></span>
                  <span>{{isNaN(numerRatio(district.reports,count))?'--':Math.abs(numerRatio(district.reports,count))+'%'}}</span>
                </div>
              </div>
              <div v-if="count=== 2" class="mt22">
                <span class="font14 white-eight">线上支付</span>
                <span class="ml5 myFont-DINPro-Medium">{{district.reports['线上支付'] || 0 }}</span>
                <span class="ml30 font14 white-eight">线下支付</span>
                <span class="ml5 myFont-DINPro-Medium">{{district.reports['线下支付'] || 0 }}</span>
              </div>
              <div class="toggle">
                <img v-show="role === '4'" :src="districtImgs(count)" />
              </div>
              <div
                v-show="role === '7' || role === '3' "
                :class="['right-icon myicon', getToggle(district,count) ? 'icon-top' : 'icon-down' ]"
                @click="changeToggle(index,district,count)"
              ></div>
            </div>
          </div>
          <div
            class="item-bottom"
            :class="{'tofixed-bottom': district.isFixedTop && district.isFixedTop[count-1] && getToggle(district,count) && count !== 2,
                    'tofixed-bottom-sec':district.isFixedTop && district.isFixedTop[count-1] && getToggle(district,count)&& count === 2}"
            v-if="getToggle(district,count)"
            :style="{'z-index':2*count-1}"
          >
            <div class="mb30" v-for="(item,itemindex) in getList(district,count)" :key="itemindex">
              <span>{{item.name}}</span>
              <div class="fr">
                <span class="myFont-DINPro-Medium">{{item.num}}</span>
                <div class="mint-badge my-badge ml10" :style="itembadgeStyle(item.ratio)">
                  <span :class="['myicon' ,parseInt(item.ratio) >= 0 ?'top' : 'down']"></span>
                  {{isNaN(parseInt(item.ratio))? '- -' : (Math.abs(parseInt(item.ratio)) + '%')}}
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
    <div v-else class="p-load">
      <span class="text">当日没有简报数据</span>
    </div>
    <my-actionsheet
      title="请选择日期"
      v-model="sheet.visible"
      :data="sheet.sheetList"
      @change="changeNow"
    ></my-actionsheet>
  </div>
</template>

<script>
import { mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  name: 'dailyReport',
  data () {
    return {
      now: this.$route.query.time || new Date().getTime(),
      role: utils.getItem('role'),
      sheetList: [],
      districtList: [],
      orderList: [],
      turnoverList: [],
      patientList: [],
      careList: [],
      heightList: [117, 162, 117, 117],
      needFixed: false,
      index: 1,
      sheet: {
        visible: false,
        sheetList: [
          {
            flex: 1,
            values: [],
            defaultIndex: 0
          }
        ]
      }
    }
  },
  created () {
    let today = new Date().getTime()
    for (var i = 29; i >= 0; i--) {
      this.sheetList.push(
        new Date(today - i * 24 * 60 * 60 * 1000).Format('MM月dd日')
      )
    }
    this.sheet.sheetList[0].values = this.sheetList
  },
  watch: {
    now: {
      immediate: true,
      handler (now) {
        this.dailyReportInit()
      }
    }
  },
  mounted () {
    if (this.role === '7' || this.role === '3') {
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('touchmove', this.handleScroll)
    }
  },
  beforeDestroy () {
    if (this.role === '7' || this.role === '3') {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('touchmove', this.handleScroll)
    }
  },
  computed: {
    timeText () {
      return new Date(this.now).Format('MM月dd日')
    }
  },
  components: {},
  methods: {
    handleScroll () {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      var height = 42 + 20 + 18 + 15
      console.log(scrollTop)
      this.districtList.forEach(m => {
        m.isFixedTop = [false, false, false]
      })
      this.districtList.map((ele, i) => {
        for (let index = 1; index < 4; index++) {
          ele.isFixedTop[index - 1] = false
          if (
            height + ele.DOMheight[index - 1] - this.heightList[index - 1] >
              scrollTop &&
            scrollTop > height &&
            this.getToggle(ele, index)
          ) {
            ele.isFixedTop[index - 1] = true
          }
          if (
            height + ele.DOMheight[index - 1] - this.heightList[index - 1] <
              scrollTop &&
            this.getToggle(ele, index)
          ) {
            this.closeToggle(ele, index)
            window.scroll(
              0,
              scrollTop -
                (ele.DOMheight[index - 1] - this.heightList[index - 1])
            )
            ele.DOMheight[index - 1] = this.heightList[index - 1]
          }

          this.$set(this.districtList, i, ele)
          height += ele.DOMheight[index - 1] + 15
        }
      })
    },
    showSheet () {
      let nowText = this.timeText
      let index = this.sheet.sheetList[0].values.indexOf(nowText)
      this.sheet.sheetList[0].defaultIndex = index
      this.sheet.visible = true
    },
    changeNow (val) {
      const month = val[0].substr(0, 2)
      const day = val[0].substr(3, 2)
      let year =
        new Date().getMonth() + 1 >= month
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1
      this.now = new Date(year, month - 1, day).getTime()
    },
    selectDate (val) {
      this.now = this.now + val * 24 * 60 * 60 * 1000
    },
    dailyReportInit () {
      this.$Indicator.open()
      this.orderList = []
      this.turnoverList = []
      this.patientList = []
      this.careList = []
      mineApi
        .getDailyReport(this.now)
        .then(resp => {
          this.districtList = resp.data.data || []
          if (this.role === '7' || this.role === '3') {
            // 院区下的病区数据
            let districts = this.districtList[0].districtBriefReports
            // 修改数据格式
            districts.forEach(item => {
              let orderObj = {
                name: item.districtName,
                num:
                  item.reports['当日订单(个)'] === '--' ||
                  !item.reports['当日订单(个)']
                    ? '--'
                    : item.reports['当日订单(个)'],
                ratio:
                  item.reports['当日订单环比'] === '--' ||
                  !item.reports['当日订单环比']
                    ? '--'
                    : item.reports['当日订单环比']
              }
              this.orderList.push(orderObj)

              let turnoverObj = {
                name: item.districtName,
                num:
                  item.reports['当日营业额(元)'] === '--' ||
                  !item.reports['当日营业额(元)']
                    ? '--'
                    : item.reports['当日营业额(元)'],
                ratio:
                  item.reports['当日营业额环比'] === '--' ||
                  !item.reports['当日营业额环比']
                    ? '--'
                    : item.reports['当日营业额环比']
              }
              this.turnoverList.push(turnoverObj)

              let patientObj = {
                name: item.districtName,
                num:
                  !item.reports['当日服务人次(人)'] ||
                  item.reports['当日服务人次(人)'] === '--'
                    ? '--'
                    : item.reports['当日服务人次(人)'],
                ratio:
                  item.reports['当日服务人次环比'] === '--' ||
                  !item.reports['当日服务人次环比']
                    ? '--'
                    : item.reports['当日服务人次环比']
              }
              this.patientList.push(patientObj)

              let carerObj = {
                name: item.districtName,
                num:
                  !item.reports['当日陪护比'] ||
                  item.reports['当日陪护比'] === '--'
                    ? '--'
                    : '1:' + item.reports['当日陪护比'],
                ratio:
                  item.reports['当日陪护比环比'] === '--' ||
                  !item.reports['当日陪护比环比']
                    ? '--'
                    : item.reports['当日陪护比环比']
              }
              this.careList.push(carerObj)
            })
            this.districtList.forEach(district => {
              this.$set(district, 'orderToggle', false)
              this.$set(district, 'turnoverToggle', false)
              this.$set(district, 'patientToggle', false)
              this.$set(district, 'careToggle', false)
            })
            this.districtList.map(m => {
              m.DOMheight = m.DOMheight || [117, 160, 117, 117]
              return m
            })
          }
        })
        .catch(e => {})
        .finally(() => {
          this.$Indicator.close()
        })
    },
    bgStyle (val) {
      switch (val) {
        case 1:
          return {
            background: '-webkit-linear-gradient(top, #534EF2, #342EDE)',
            // height: this.heightList[0] + 'px',
            zIndex: 2
          }
        case 2:
          return {
            background: '-webkit-linear-gradient(top, #4E68F7, #617BFC)',
            // height: this.heightList[1] + 'px',
            zIndex: 4
          }
        case 3:
          return {
            background: '-webkit-linear-gradient(top, #4C8CFF, #76A7FF)',
            // height: this.heightList[2] + 'px',
            zIndex: 6
          }
        case 4:
          return {
            background: '-webkit-linear-gradient(top, #4ab2ff, #8cb4ff)',
            // height: this.heightList[3] + 'px',
            zIndex: 8
          }
        default:
          return {}
      }
    },
    itembadgeStyle (val) {
      return val > 0
        ? {
          backgroundColor: 'rgba(242, 121, 103, 0.08)',
          color: 'rgba(242, 121, 103, 1)'
        }
        : {
          backgroundColor: 'rgba(150, 216, 157, 0.1)',
          color: 'rgba(150, 216, 157, 1)'
        }
    },
    titleText (val) {
      switch (val) {
        case 1:
          return '当日订单(个)'
        case 2:
          return '当日营业额(元)'
        case 3:
          return '当日服务人次(人)'
        case 4:
          return '当日陪护比'
        default:
          return ''
      }
    },
    districtImgs (val) {
      switch (val) {
        case 1:
          return require('../../assets/imgs/currentOrder@2x.png')
        case 2:
          return require('../../assets/imgs/currentTurnover@2x.png')
        case 3:
          return require('../../assets/imgs/currentRatio@2x.png')
        case 4:
          return require('../../assets/imgs/dailyBriefPie@2x.png')
        default:
          return ''
      }
    },
    numerValue (district, index) {
      switch (index) {
        case 1:
          return district['当日订单(个)'] || '--'
        case 2:
          return district['当日营业额(元)'] || '--'
        case 3:
          return district['当日服务人次(人)'] || '--'
        case 4:
          return !district['当日陪护比'] || district['当日陪护比'] === '--'
            ? '--'
            : '1:' + (district['当日陪护比'] || '--')
        default:
          return 0
      }
    },
    getToggle (district, index) {
      switch (index) {
        case 1:
          return district.orderToggle
        case 2:
          return district.turnoverToggle
        case 3:
          return district.patientToggle
        case 4:
          return district.careToggle
        default:
          return 0
      }
    },
    closeToggle (district, count) {
      switch (count) {
        case 1:
          district.orderToggle = false
          return
        case 2:
          district.turnoverToggle = false
          return
        case 3:
          district.patientToggle = false
          return
        case 4:
          district.careToggle = false
          return
        default:
          return ''
      }
    },
    changeToggle (index, district, count) {
      var temp = this.districtList[index]
      this.districtList.splice(index, 1, temp)
      this.$nextTick(() => {
        temp.DOMheight[count - 1] = this.$refs[ index + 'scrollMonth' + count ][0].offsetHeight
      })
      switch (count) {
        case 1:
          district.orderToggle = !district.orderToggle
          return
        case 2:
          district.turnoverToggle = !district.turnoverToggle
          return
        case 3:
          district.patientToggle = !district.patientToggle
          return
        case 4:
          district.careToggle = !district.careToggle
          return
        default:
          return ''
      }
    },
    getList (district, index) {
      switch (index) {
        case 1:
          return this.orderList
        case 2:
          return this.turnoverList
        case 3:
          return this.patientList
        case 4:
          return this.careList
        default:
          return 0
      }
    },
    numerRatio (district, index) {
      switch (index) {
        case 1:
          return parseInt(district['当日订单环比']) || '--'
        case 2:
          return parseInt(district['当日营业额环比']) || '--'
        case 3:
          return parseInt(district['当日服务人次环比']) || '--'
        case 4:
          return parseInt(district['当日陪护比环比']) || '--'
        default:
          return 0
      }
    }
  }
}
</script>
<style lang='less' type='text/less'>
@toggle-size: 77px;
.daily-report {
  .date {
    height: 42px;
    line-height: 22px;
    box-sizing: border-box;
    display: flex;
    .front {
      width: 29%;
      border-right: 1px solid #eeeff1;
    }
    .middle {
      width: 41.86%;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        margin-top: -7.5px;
        height: 15px;
      }
      span {
        margin-left: 26px;
      }
    }
    .behind {
      width: 29%;
      border-left: 1px solid #eeeff1;
    }
  }
  .reports {
    position: relative;
    z-index: 0;
    margin: 20px 15px;
    .title {
      padding-left: 14px;
      position: relative;
      &:before {
        background-color: rgba(31, 193, 201, 1);
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
        width: 4px;
        height: 12px;
      }
    }
    .item {
      position: relative;
      margin-bottom: 15px;
      background-color: @color-white;
      box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
      overflow: hidden;
      .border_radius();
      .item-top {
        position: relative;
        padding: 20px 15px 25px 15px;
        min-height: 63px;
        color: @color-white;
        border-radius: 5px 5px 0 0;
        .white-eight {
          color: rgba(255, 255, 255, 0.8);
        }
        .second {
          .bg-black {
            background-color: rgba(24, 24, 24, 0.15);
          }
        }
        .toggle {
          position: absolute;
          height: @toggle-size;
          width: @toggle-size;
          top: 0;
          right: 0;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .right-icon {
          position: absolute;
          top: 50%;
          right: 30px;
          margin-top: -10px;
        }
        .icon-down:before {
          font-size: 3rem;
        }
        .icon-top:before {
          font-size: 3rem;
        }
      }
      .tofixed-top {
        position: fixed;
        left: 15px;
        right: 15px;
        top: 44px;
        background-color: #fff;
        box-shadow: 0px 0px 18px 0px rgba(16, 47, 163, 0.07);
      }
      .item-bottom {
        // position: relative;
        background-color: @color-white;
        padding: 30px @m15;
        div:last-child {
          margin-bottom: 0;
        }
        .my-badge {
          min-width: 38px;
        }
      }
      .my-badge {
        line-height: 12px;
        border-radius: 1px;
        font-size: 12px;
        padding: 2px 10px;
        .myicon {
          margin-top: -2px;
          height: 0;
          width: 0;
          border-width: 4px;
          border-style: solid;
          border-left-color: transparent;
          border-right-color: transparent;
        }
        .down {
          border-bottom-width: 0;
        }
        .top {
          border-top-width: 0;
        }
      }
    }
  }
  .p-load {
    text-align: center;
    margin: 0 auto;
    padding: 20px;
    .text {
      color: #8d929e;
      font-size: 16px;
      vertical-align: middle;
    }
  }
}
</style>
