<template>
  <div class="data-stats">
    <my-header title="数据统计"></my-header>
    <dataSum :echarts="echarts"></dataSum>
    <chart-orderTrend class="mt10" :echarts="echarts" ></chart-orderTrend>
    <chart-orderDistrict class="mt10" :echarts="echarts" ></chart-orderDistrict>
    <chart-income class="mt10" :echarts="echarts"></chart-income>
    <workingTimes class="mt10" :echarts="echarts"></workingTimes>
  </div>
</template>
<script>
import dataSum from './dataSum'
import chartIncome from './chartIncome'
import workingTimes from './workingTimes'

import chartOrderTrend from './chartOrderTrend'
import chartOrderDistrict from './chartOrderDistrict'
const echarts = require('echarts')
export default {
  data () {
    return {
      echarts: echarts
    }
  },
  components: {
    dataSum,
    chartOrderTrend,
    chartOrderDistrict,
    chartIncome,
    workingTimes
  },
  created () {},
  methods: {}
}
</script>

<style lang="less">
.data-stats {
  .tooltip {
    > div {
      // width: 125px;
      display: inline-block;
      box-sizing: border-box;
      padding: 0 20px;
      position: relative;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
      }
      &:first-child,&.borderR {
        &::before {
          content: '';
          position: absolute;
          right: 0;
          top: 6px;
          bottom: 6px;
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .chartEmpty{
    height: 300px;
    .chartEmptyImg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom:0;
      margin: auto;
      width: 100px;
      height:40px;
      background-color: rgba(255, 255, 255, 0.8);
      background-image: url('../../../assets/imgs/dataStats/APP_NoData.png');
      background-size: contain;
      background-repeat: no-repeat;

      font-size: 16px;
      color: @color-green;
      line-height: 400px;
      text-align: center;
    }
  }

}
</style>
