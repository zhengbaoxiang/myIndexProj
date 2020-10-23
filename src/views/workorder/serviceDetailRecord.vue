<template>
  <ul v-if="recordList.length>0" class="templates bg-white" >
    <li class="clearfix ptb15 plr5 rel bdbt item" v-for="(item,index) in recordList" :key="index">
      <div class="clearfix  font14 "
      >日常查房记录表 - {{timeFormat(item.inspectTime)}}</div>
      <div class="clearfix  font12"
      >评价人: {{item.creator}}</div>
      <span class="arrow" @click="openRecord(item.id)">
        <i class="mint-cell-allow-right"></i>
      </span>

    </li>
  </ul>
  <div v-else class="nodata">
    <div></div>
    <span>暂无数据</span>
  </div>
</template>
<script>
import { workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  data () {
    return {
      path: window.hcsConfig.imgURL,
      recordList: []
    }
  },
  props: {
    serviceOrder: {
      default: function () {
        return []
      }
    },
    role: {
      default: '0'
    }

  },
  updated () {
  },
  mounted () {
    this.getInspectRecords(this.serviceOrder.id)
    utils.setBasicInfo(this.serviceOrder)
  },
  methods: {
    // 获取当前所有的巡查记录列表
    getInspectRecords (serviceId) {
      workOrderApi.getInspectRecords(serviceId).then((resp) => {
        this.recordList = resp.data.data
      })
    },
    openRecord (id) {
      console.log(`跳转至id为${id}的巡查记录`)
      this.$router.push({
        name: 'departmentInspection',
        query: {
          serviceId: this.serviceOrder.id,
          orderId: this.serviceOrder.orderId,
          inspectionItemId: id }
      })
    },
    timeFormat (time, formatStr = 'yyyy.MM.dd hh:mm') {
      // 'yyyy年MM月dd日hh时mm分ss秒'
      return new Date(time).Format(formatStr)
    }

  }
}
</script>
<style lang="less" scoped>
.templates {
  padding: 15px 15px 0 15px;
  li{
    height: 67px;
    box-sizing: border-box;
    div.font14{
      height: 20px;
      color: #3e4255;
      font-weight: 500;
    }
    div.font12{
      height: 17px;
      color: rgba(141, 146, 158, 100);
    }
    .arrow{
      color: rgba(141, 146, 158, 100);
      i{
        right: 0;
      }
    }

  }

}
.nodata{
  div{
    width: 189px;
    height: 120px;
    margin: 60px auto 10px;
    opacity: 0.9;
    background: url('../../assets/imgs/nodata@2x.png');
    background-size: contain;
  }
  span{
    display: block;
    width: 64px;
    height: 22px;
    opacity: 0.5;
    color: rgba(141, 146, 158, 100);
    font-size: 16px;
    text-align: center;
    margin: auto;
  }
}

</style>
