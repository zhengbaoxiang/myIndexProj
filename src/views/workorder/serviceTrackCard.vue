<template>
  <ul class="serviceTrackCard ptb10">
    <li class="clearfix  font12  ptb10 bdbt">
        <span class="special-border-right10 rel pr5 text-grey"
          :style="
            serviceOrder.payStatus === 2 ?  '':'color: #1FC1C9'
              "
          > {{ statusFormat(serviceOrder.payStatus) }}
        </span>
        <span class="rel plr5 text-grey" v-if="serviceOrder.serviceDateLength"
          >服务共{{ serviceOrder.serviceDateLength }}天</span>
        <span class="rel plr5 text-grey" v-else
          >开放服务</span>
        <span class="rel plr5 text-grey"
          >当前第{{ serviceOrder.serviceDateIndex }}天</span>

        <router-link   :to="{
              name: 'orderDetail',
              query: { orderId: serviceOrder.orderId }
            }"
          >
            <span v-if="role === '4'" class="rel plr5 fr text-green"
              > 订单详情 > </span>
        </router-link>

    </li>
    <ul class="clearfix " @click.stop="goServiceDetail(serviceOrder.id)">
      <li class="clearfix pt10 rel">
        <span class="font20 fl">{{ serviceOrder.bedName }}-{{ serviceOrder.patientName }}</span>
        <mt-badge size="normal" class="num"
          :style="
            serviceOrder.sumRealCount === serviceOrder.sumTotalCount
              ? 'background-color: rgba(199, 199, 204, 1);font-size: 14px'
              : ''
          "
        >
          {{ getCompStatus(serviceOrder.sumRealCount, serviceOrder.sumTotalCount) }}
        </mt-badge>
      </li>
      <li class="clearfix ">
        <div class="ml5 fl">
          <mt-badge size="small">{{ serviceOrder.districtName }}</mt-badge>
        </div>
      </li>
      <li class="clearfix text-grey font14 mt10 orderWorkers">
        <span v-if="orderWorkers"
          class="plr5 fl">  服务护工
        </span>
        <span  v-if="showArrow"
            class="fr" @click.stop="showAll=!showAll"
            :class="['myicon', showAll ? 'icon-top' : 'icon-down']"
        ></span>
        <span class="fr "
          ref='orderWorkers'
          :class="[showAll ? 'wrap' : 'nowrap',showArrow ? 'WorkersName':'']">
          {{ orderWorkers }}
          </span>

      </li>
    </ul>
  </ul>
</template>
<script>
export default {
  name: 'serviceTrackCard',
  props: {
    role: {
      default: null
    },
    serviceOrder: {
      default: function () {
        return {}
      }
    },
    componentId: {
      default: 'serviceTrack'
    }
  },

  data () {
    return {
      orderWorkers: '',
      showAll: false,
      showArrow: false
    }
  },
  created () { },
  mounted () {
    // 指派的护工人员列表，teamManagerName 的逻辑有问题，在这个列表里
    if (this.serviceOrder.orderWorkers) {
      const nameList = this.serviceOrder.orderWorkers.map(item => {
        return item.name
      })
      this.orderWorkers = nameList.join(',')
      setTimeout(() => {
        this.showArrow = this.$refs.orderWorkers.clientWidth >= 200
      }, 50)
    }
  },
  activated () {},
  methods: {
    getCompStatus (comp, total) {
      return comp === total ? '已完成' : comp + '/' + total
    },
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
    },
    selfCareFormat: function (selfCare) {
      switch (selfCare) {
        case 1:
          return '自理'
        case 2:
          return '半自理'
        case 3:
          return '不能自理'
        default:
          return ''
      }
    },
    statusFormat (payStatus) {
      // 服务页面只考虑待支付和已支付两种。
      // const payStatusList = ['已取消', '待支付', '已支付', '待退款', '退款中', '已退款', '退款失败', '延期支付']
      return payStatus === 2 ? '已支付' : '待支付'
    },
    goServiceDetail (id) {
      // 跳到服务选择页面
      /* <router-link
          :to="{
            name: 'serviceOrderDetail',
            query: { serviceOrderId: item.id }
          }"
        > */
      if (this.componentId !== 'serviceTrack') return
      this.$router.push({
        name: 'serviceOrderDetail',
        query: { serviceOrderId: id }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.serviceTrackCard{
   .font20 {
      height: 28px;
    }
    .ml5 {
      height: 24px;
      line-height: 24px;
      .mint-badge.is-size-small {
        height: 14px;
        line-height: 14px;
        background-color: rgba(252, 236, 181, 1);
        color: rgba(193, 151, 5, 1);
      }
    }

  .num {
    position: absolute;
      top: 50%;
      right: -15px;
      padding-left: @m15;
      padding-right: @m15;
      border-radius: 100px 0px 0px 100px;
      line-height: 18px;
      font-size: 16px;
  }
  .orderWorkers{
    line-height: 20px;
    .WorkersName{
      width: 210px;
    }
    .wrap{
      white-space: wrap;
    }

  }

}
</style>
