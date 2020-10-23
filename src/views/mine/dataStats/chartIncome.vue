<template>
  <div class="bg-white mt10 chartIncome">
    <h3 class="mint-cell font18 p15">科室营收占比</h3>
    <div class="ptb20 rel">
      <my-radiogroup
        large
        :options="Options"
        @change="optionChange"
        v-model="defaultOption"
        class="mb30 plr15"
      ></my-radiogroup>
      <!-- <div class="detail pt20" v-if="false">
          <div class="a" >
            <div class="subtitle">科室</div>
            <div class="count borderR rel">{{curName}}</div>
          </div>
          <div class="b" >
            <div class="subtitle">营收金额(万元)</div>
            <div class="count borderR rel">{{curValue}}</div>
          </div>
          <div class="c">
            <div class="subtitle">营收占比</div>
            <div class="count">{{curProportion}}%</div>
          </div>
      </div> -->
      <div v-show="!chartEmpty" id="incomeChart"></div>
      <div v-show="!chartEmpty" class="legend">
        <div class="pagebutton" v-if="pages>1">
          <div class="icon up" @click='changepage(-1)'></div>
          <div class="num">{{currentIndex}}/{{pages}}</div>
          <div class="icon down"  @click='changepage(1)'></div>
        </div>
        <ul class="labelList" ref="labelList">
          <li v-for="(item,index) in legendList" :key='index' @click.stop='selecteLegend(item)'>
            <i class="icon" :style="{'backgroundColor': colorListAll[index]}" >
                 <i class="icon_selected" v-show="curName===item"
                :style="{'backgroundColor': colorListAll[index]}" ></i>
            </i>

            <span class="label" :class="{'selected':curName===item}">{{item}}</span>
          </li>
        </ul>
      </div>
      <div v-show="chartEmpty" class="chartEmpty">
        <p  class="chartEmptyImg"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { dashBoardApi } from '@/assets/api'
export default {
  props: {
    echarts: {
      default: Object
    }
  },
  data () {
    return {
      incomeChart: null,
      chartEmpty: false,
      Options: [
        {
          label: '当天',
          value: '0'
        },
        {
          label: '近1周',
          value: '6'
        },
        {
          label: '近1月',
          value: '29'
        },
        {
          label: '近3月',
          value: '89'
        }
      ],
      defaultOption: '0',
      curName: '',
      curValue: 0,
      curProportion: 0,
      legendList: [],
      dataList: [],
      colorList: ['#73A0FA', '#C7D9FD', '#73DEB3', '#C7F1E0',
        '#7585A2', '#CBD0DB', '#F7C739', '#FBE9B0',
        '#EB7E65', '#F7CCC2', '#83D0EF', '#C1E7F6',
        '#A285D2', '#D9CEED', '#FFAB67', '#FFDEC2',
        '#46A9A8', '#B7DEDE', '#FFA8CC', '#FFDCEA' ],
      colorListAll: [],
      currentIndex: 1,
      pages: 1,
      firstFinished: false,
      totalNum: 0,
      totalLabel: '总营收(万元)'
    }
  },
  created () {},
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.incomeChart = this.echarts.init(
      document.getElementById('incomeChart')
    )
    this.optionChange(this.defaultOption)
    this.handlerEvent() // 监听事件
  },
  methods: {
    optionChange (date) {
      const param = {
        beginDate: new Date(
          new Date().getTime() - date * 24 * 60 * 60 * 1000
        ).Format('yyyy-MM-dd'),
        endDate: new Date().Format('yyyy-MM-dd')
      }
      console.log('optionChange', date, param)
      this.getData(param)
      this.currentIndex = 1
      this.$refs.labelList.style.top = 0
    },
    getData (param) {
      this.incomeChart.showLoading('default', {
        text: '加载中...',
        color: '#1FC1C9',
        textColor: '#1FC1C9',
        fontSize: 16,
        spinnerRadius: 16,
        lineWidth: 2
      })
      dashBoardApi.districtRevenueProportion(param).then((resp) => {
        this.incomeChart.hideLoading()
        // console.log(resp.data.data)
        // 总营收金额
        const total = resp.data.data.total || 0
        const isLarge = total > 1000000
        this.totalLabel = isLarge ? '总营收(万元)' : '总营收(元)'
        this.totalNum = this.numberFormat((total / (isLarge ? 1000000 : 100)).toFixed(2))

        const data = resp.data.data.revenueList
        if (data && data.length > 0 && total > 0) {
          this.chartEmpty = false
          this.legendList = []
          this.dataList = []
          this.colorListAll = []

          data.forEach((item, index) => {
            if (item.value !== 0) {
              item.value = Number(item.value).toFixed(2)
              item.proportion = Number(item.proportion).toFixed(2)
              this.legendList.push(item.districtName)
              this.dataList.push({
                value: item.value,
                name: item.districtName,
                proportion: item.proportion
              })
            }
          })
          this.pages = parseInt(this.dataList.length / 9) + 1
          this.dataList.forEach((item, index) => {
            // 颜色数组扩展
            while (index >= this.colorList.length) {
              index = index - this.colorList.length
            }
            this.colorListAll.push(this.colorList[index])
          })
          this.drawCircle(this.legendList, this.dataList)
          this.firstFinished = false
        } else {
          this.chartEmpty = true
        }
      })
    },
    drawCircle (legendList, dataList) {
      this.incomeChart.setOption({
        title: {
          show: this.totalNum !== '0',
          top: '42%',
          left: 'center',
          text: this.totalNum,
          subtext: this.totalLabel,
          padding: 0,
          itemGap: 0,
          // textAlign: 'center',
          textStyle: {
            color: '#4A4A4A',
            height: 0,
            lineHeight: 20,
            fontSize: 16,
            fontFamily: 'DINPro-Medium'
          },
          subtextStyle: {
            color: '#8D929E',
            height: 17,
            lineHeight: 17,
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular'
          }

        },
        tooltip: {
          show: true,
          trigger: 'item',
          extraCssText: 'z-index:1',
          // tooltip固定在顶部，配合top：-30，以及上一个元素class="mb30"
          position: function (pos, params, dom, rect, size) {
            return {
              top: -30,
              left: (size.viewSize[0] - size.contentSize[0]) / 2
            }
          },
          transitionDuration: 0, // 无需提示框的动画
          backgroundColor: 'transparent', // 设置提示框背景色
          padding: 20, // 设置提示框内边距
          alwaysShowContent: true, // 设置提示框永久展示
          // 自定义提示框的格式
          // formatter: '{a} <br/>{b}: {c} ({d}%)',
          formatter: (params) => {
            const disname = params.data.name
            const proportion = params.data.proportion
            console.log(proportion)
            const data = params.data.value
            const isLarge = data > 1000000
            const value = this.numberFormat((data / (isLarge ? 1000000 : 100)).toFixed(2))

            const labelName = isLarge ? '营收金额(万元)' : '营收金额(元)'
            const DOM =
              `<div class="tooltip">
                <div class='borderR'>
                  <p class="text-grey">科室</p>
                  <p class="myFont-DINPro-Medium text-default font16">` +
                  disname +
                  `</p>
                </div>
                <div class='borderR'>
                  <p class="text-grey">${labelName}</p>
                  <p class="myFont-DINPro-Medium text-default font16">` +
                  value +
                  `</p>
                </div>
                <div>
                  <p class="text-grey">营收占比</p>
                  <p class="myFont-DINPro-Medium text-default font16">` +
                  proportion +
                  `%</p>
                </div>
              </div>`
            return DOM
          }
        },
        textStyle: {
          color: 'grey',
          fontSize: 10,
          height: 16,
          lineHeight: 16
        },
        // 色系
        color: this.colorListAll,
        legend: {
          show: false,
          id: 1786,
          // type: 'scroll', // 滚动图例，只能设置单方的尺寸
          orient: 'horizontal',
          // orient: 'vertical',
          // type: 'plain', // 默认平铺，图例可设置宽高，
          // height: 800,
          width: 300,
          top: 120,
          selectedMode: true, // 'single' multiple ,true,单选多选，切换显隐
          icon: 'circle',
          itemHeight: 12,
          itemWidth: 12,
          data: legendList
        },
        series: [
          {
            type: 'pie',
            id: 'seriesId',
            name: 'serierName',
            // roseType: 'radius',
            selectedOffset: 10,
            selectedMode: 'single',
            hoverAnimation: false,
            hoverOffset: 10,
            animationDuration: 10,
            avoidLabelOverlap: false,
            stillShowZeroSum: false, // 和为零 不显示

            label: {
              show: false,
              position: 'center',
              color: 'red'
            },
            labelLine: {
              show: false
            },
            // 高亮扇区
            emphasis: {
              label: {
                show: false,
                color: 'red'
              }
            },
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: dataList
          }
        ]
      })
    },
    dispatchDefaultTip (obj, dataList) {
      const data0 = dataList[0] || {}
      const name = data0.name
      // 设置默认选中的数据
      obj.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0,
        name: name
      })
      // 先清掉，再赋值
      this.curName = ''
      obj.dispatchAction({
        type: 'legendSelect',
        name: name
      })
    },

    // 图表的监听事件
    handlerEvent () {
      const chart = this.incomeChart

      chart.on('finished', () => {
        if (this.firstFinished) return
        // 默认选中首个
        // console.log(311)
        this.dispatchDefaultTip(this.incomeChart, this.dataList)
        this.firstFinished = true
      })

      // 鼠标点击图表
      chart.on('click', params => {
        console.log(params)
        // console.log('click', params.dataIndex, params.name, params.value, params.percent)
        // this.curName = params.name
        // this.curValue = params.value
        // this.curProportion = params.percent
        // this.selecteLegend(params.name)
      })

      // 监听点击图例事件
      chart.on('legendselected', item => {
        // if (this.curName === item.name) return
        console.log('legendselected', item)

        // 取消上一次选中
        chart.dispatchAction({
          type: 'pieUnSelect',
          name: item.name
        })
        // 设置本次选中值
        setTimeout(() => {
          chart.dispatchAction({
            type: 'pieSelect',
            name: item.name
          })
        }, 80)
        chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          // dataIndex: 0,
          name: item.name
        })

        // 同步修改顶部信息
        this.dataList.some(el => {
          if (el.name === item.name) {
            this.curName = el.name
            this.curValue = el.value
            this.curProportion = el.proportion
            return true
          }
        })
      })

      // // // // 监听事件
      // chart.on('pieselected', item => {
      //   console.log('pieselected', item)
      // })
      // chart.on('pieunselected', item => {
      //   console.log('pieunselected', item)
      // })
      // // 点击图例开关
      // chart.on('legendselectchanged', item => {
      //   console.log('legendselectchanged', item)
      //  chart.setOption({
      //     legend: { selected: { [item.name]: true } }
      //   })
      // })
    },
    selecteLegend (name) {
      // 手动点击时触发相关选中事件。
      this.incomeChart.dispatchAction({
        type: 'legendSelect',
        name: name
      })
    },
    changepage (val) {
      let index = this.currentIndex + val
      if (index === 0 || index > this.pages) return
      this.currentIndex = index
      this.$refs.labelList.style.top = -102 * (index - 1) + 'px'
    },
    // 千分位
    numberFormat (num) {
      const str = Number(num).toLocaleString()
      // console.log(typeof str, str)
      return str
    }

  }
}
</script>
<style lang="less" scoped>
.chartIncome{
  .detail{
        display: flex;
        &>div{
          // flex-grow: 1;
          // flex-shrink: 1;
          width:33%;
          text-align: center;

          .subtitle{
            color: rgba(141, 146, 158, 100);
            font-size: 14px;
          }
          .count{
            font-size: 16px;
            text-align: center;
            padding: 5px;
            color: rgba(74, 74, 74, 100);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

          }
          .borderR::before {
            content: '';
            position: absolute;
            right: 0;
            top: -5px;
            height: 30px;
            border-right: 1px solid #d8dadf;
          }
        }

  }
  #incomeChart {
  height: 270px;
  }
  .legend{
    position: relative;
    padding: 0 33px 0 40px;

    max-height: 102px;
    min-height: 34px;
    // border: 1px solid black;
    vertical-align: text-top;
    overflow: hidden;
    .pagebutton{
      position: absolute;
      right: 20px;
      top:0;
      height: 110px;
      .icon{
        height: 18px;
        width: 18px;
        margin: 14px 0;
        background-size: contain

      }
      .icon.up{
          background-image: url('../../../assets/imgs/dataStats/arrow_up@2x.png');
      }
      .icon.down{
          background-image: url('../../../assets/imgs/dataStats/arrow_down@2x.png');
      }
      .num{
        width: 20px;
        height: 12px;
        vertical-align: text-top;
        color: rgba(74, 74, 74, 100);
        font-size: 10px;
        text-align: left;
      }
    }
    .labelList{
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      top:0;
      transition: top 0.5s ease-in ;
      & li{
        // flex:1 0 auto;
        position: relative;
        padding: 10px ;
        height: 34px;
        width: 30%;
        box-sizing: border-box;
        // border: 1px solid red;

        i.icon{
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: absolute;
          top:50%;
          transform: translateY(-50%);
          left:-10px;
        }

        .icon_selected{
          display: block;
          border-radius: 50%;
          z-index: -1;
          opacity: 0.2;
          width: 22px;
          height: 22px;
          position: absolute;
          top:50%;
          left: 50%;
          transform: translate(-50%,-50%);

        }
        span.label{
          display: inline-block;
          width: 90%;
          height: 14px;
          color: rgba(153, 153, 153, 100);
          line-height: 14px;
          font-size: 10px;
          text-align: left;
          vertical-align: text-top;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .label.selected{
          color: rgba(74, 74, 74, 100);
        }
      }
    }

  }

}

</style>
