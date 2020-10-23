<template>
  <div>
    <div class="bg-white">
      <h3 class="mint-cell font18 p15">订单量趋势</h3>
      <div class="ptb20 rel">
        <my-radiogroup
          large
          :options="trendDateOptions"
          @change="trendOrderNum"
          v-model="trendDate"
          class="mb30 plr15"
        ></my-radiogroup>
        <div v-show="!chartEmpty" id="orderChartTrend" class="hr-300"></div>
        <div v-show="chartEmpty" class="chartEmpty">
          <p  class="chartEmptyImg"></p>
        </div>
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
      myChartTrend: null,
      chartEmpty: false,
      trendDateOptions: [
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
      trendDate: '29'
    }
  },
  created () {},
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChartTrend = this.echarts.init(
      document.getElementById('orderChartTrend')
    )
    this.trendOrderNum(this.trendDate)
  },
  methods: {
    trendOrderNum (data) {
      const param = {
        beginDate: new Date(
          new Date().getTime() - data * 24 * 60 * 60 * 1000
        ).Format('yyyy-MM-dd'),
        endDate: new Date().Format('yyyy-MM-dd')
      }
      this.myChartTrend.showLoading('default', {
        text: '加载中...',
        color: '#1FC1C9',
        textColor: '#1FC1C9',
        fontSize: 16,
        spinnerRadius: 16,
        lineWidth: 2
      })
      dashBoardApi.datesCareOrderNum(param).then((resp) => {
        this.myChartTrend.hideLoading()
        if (resp.data && resp.data.data && resp.data.data.length > 0) {
          this.chartEmpty = false
          this.drawTrendData(resp.data.data)
          this.dispatchDefaultTip(this.myChartTrend, resp.data.data.length)
        } else {
          this.chartEmpty = true
        }
      })
    },
    drawTrendData (data) {
      // 绘制图表 - 订单趋势图
      this.myChartTrend.setOption({
        grid: {
          right: 16,
          bottom: 20
        },
        tooltip: {
          trigger: 'axis', // 允许点击坐标轴就触发
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed', // 十字准星竖线条虚线
              color: '#FF8113' // 十字准星竖线条颜色
            },
            // 坐标轴指示器文本效果
            label: {
              show: true,
              backgroundColor: '#FF8113',
              borderRadius: 2
            }
          },
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
          extraCssText: 'z-index:1',
          // 自定义提示框的格式
          formatter: (params) => {
            const name = params[0].name
            const data = params[0].data
            const DOM =
              `<div class="tooltip"><div>
              <p class="text-grey">时间</p>
              <p class="myFont-DINPro-Medium text-default font16">` +
              name +
              `</p></div><div>
              <p class="text-grey">订单量（个）</p>
              <p class="myFont-DINPro-Medium text-default font16">` +
              data +
              `</p></div></div>`
            return DOM
          }
        },
        // 放大缩小设置
        dataZoom: {
          type: 'inside',
          disabled: true
        },
        // 横纵坐标文字颜色灰色
        axisLabel: {
          color: '#8D929E'
        },
        xAxis: {
          // 横坐标数据
          data: data.map((item) => item.date),
          boundaryGap: false,
          // 横坐标坐标轴线条颜色置灰
          axisLine: {
            lineStyle: {
              color: '#8D929E'
            }
          },
          axisLabel: {
            formatter: (value) => value.substr(5, 5)
          }
        },
        yAxis: {
          minInterval: 1, // 纵坐标最小单位1
          // y轴的刻度不展示
          axisTick: {
            show: false
          },
          // y轴的线条不展示
          axisLine: {
            show: false
          }
        },
        // 图表数据格式
        series: {
          type: 'line', // 折线图
          data: data.map((item) => item.orderNum), // 纵坐标的数据
          symbol: 'circle', // 数据点格式
          symbolSize: 2, // 数据点大小
          showAllSymbol: true, // 展示所有数据点
          // 折线拐点标志颜色
          itemStyle: {
            color: '#FF8113'
          },
          // 折线颜色
          lineStyle: {
            color: '#FF8113'
          },
          // 面积区域设置，线性渐变，从上到下
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#FFE8D4' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'white' // 100% 处的颜色
                }
              ]
            }
          }
        }
      })
    },
    dispatchDefaultTip (obj, length) {
      // 设置默认选中靠右边的数据
      obj.dispatchAction({
        type: 'showTip',
        // 系列的 index
        seriesIndex: 0,
        // 数据的 index
        dataIndex: length - 1
      })
    }
  }
}
</script>
