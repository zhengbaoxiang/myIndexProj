<template>
  <div>
    <div class="bg-white">
      <h3 class="mint-cell font18 p15">科室订单量</h3>
      <div class="pt20 pb10 rel">
        <my-radiogroup
          large
          :options="districtDateOptions"
          @change="districtOrderNum"
          v-model="districtDate"
          class="mb30 plr15"
        ></my-radiogroup>
        <div v-show="!chartEmpty" id="orderChartDistrict" class="hr-300"></div>
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
      myChartDistrict: null,
      chartEmpty: false,
      districtDateOptions: [
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
      districtDate: '0'
    }
  },
  created () {},
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChartDistrict = this.echarts.init(
      document.getElementById('orderChartDistrict')
    )
    this.districtOrderNum(this.districtDate)
  },
  methods: {
    districtOrderNum (data) {
      const param = {
        beginDate: new Date(
          new Date().getTime() - data * 24 * 60 * 60 * 1000
        ).Format('yyyy-MM-dd'),
        endDate: new Date().Format('yyyy-MM-dd')
      }
      this.myChartDistrict.showLoading('default', {
        text: '加载中...',
        color: '#1FC1C9',
        textColor: '#1FC1C9',
        fontSize: 16,
        spinnerRadius: 16,
        lineWidth: 2
      })
      dashBoardApi.districtsCareOrderNum(param).then((resp) => {
        this.myChartDistrict.hideLoading()
        if (resp.data && resp.data.data && resp.data.data.length > 0) {
          this.chartEmpty = false
          this.drawDistrictData(resp.data.data || [])
          this.dispatchDefaultTip(this.myChartDistrict)
        } else {
          this.chartEmpty = true
        }
      })
    },
    drawDistrictData (data) {
      // 绘制图表 - 病区订单量柱状图
      this.myChartDistrict.setOption({
        grid: {
          right: 16
        },
        tooltip: {
          trigger: 'axis', // 允许点击坐标轴就触发
          axisPointer: {
            type: 'shadow', // 点击后背景浅阴影
            shadowStyle: {
              color: 'rgba(0, 0, 0, 0.04)'
            }
          },
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
          formatter: (params) => {
            const name = params[0].name
            const data = params[0].data
            const DOM =
              `<div class="tooltip"><div>
              <p class="text-grey">科室</p>
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
        // 坐标文字颜色灰色
        axisLabel: {
          color: '#8D929E'
        },
        // 允许横向拖动的设置
        dataZoom: {
          type: 'inside',
          zoomLock: true, // 仅允许横向拖动，不能放大缩小
          startValue: 0,
          endValue: data.length > 9 ? 9 : data.length // 固定最大10条数据，否则自适应
        },
        xAxis: {
          animation: false, // 横坐标拖动时无需动画效果
          // 横坐标数据
          data: data.map((item) => item.districtName),
          // 横坐标样式 - 全部展示且倾斜45度
          axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: (value) => {
              if (value.length > 5) {
                return value.substr(0, 4) + '...'
              }
              return value
            }
          },
          // 横坐标坐标轴线条颜色置灰
          axisLine: {
            lineStyle: {
              color: '#8D929E'
            }
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
        series: [
          {
            type: 'bar', // 柱状图
            data: data.map((item) => item.orderNum), // 纵坐标的数据
            barWidth: '25%', // 内容宽度
            // 默认的数据条颜色
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: 'rgba(255, 129, 19, 0.3)'
            },
            // 选中效果 - 设置数据条颜色
            emphasis: {
              itemStyle: {
                color: 'rgba(255, 129, 19, 1)'
              }
            }
          }
        ]
      })
    },
    dispatchDefaultTip (obj) {
      obj.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0
      })
      // 高亮选中的数据
      obj.dispatchAction({
        type: 'highlight',
        dataIndex: 0
      })
    }
  }
}
</script>
