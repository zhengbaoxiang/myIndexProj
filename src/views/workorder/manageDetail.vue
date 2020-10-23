<template>
  <div class="workorder-manageDetail" v-if="orderInfo">
    <my-header title="工单详情"></my-header>
    <div class="pb65">
      <div class="card p15">
        <div class="clearfix">
          <span class="fl font20">{{orderInfo.bedName}}</span>
          <div class="ml5 fl">
            <mt-badge size="small">{{orderInfo.districtName}}</mt-badge>
          </div>
          <img
            class="ml5"
            :src="require(orderInfo.deviceStatus?'../../assets/imgs/belled.png' : '../../assets/imgs/unbell.png') "
          />
          <img
            class="ml5"
            :src="require(orderInfo.wristBandStatus != 1?'../../assets/imgs/unwristBand.png' : '../../assets/imgs/wristBand.png') "
          />
          <span
            class="fr font14"
            :class="{ 'text-green': (orderInfo.serviceStatus === 2), 'text-grey':  (orderInfo.serviceStatus === 1 || orderInfo.serviceStatus == 3)}"
          >{{orderInfo.serviceStatus | getServiceStatus}}</span>
        </div>
        <div class="clearfix mt10">
          <span class="fl">{{orderInfo.patientName}}</span>
          <span class="fr">{{orderInfo.productBigTitle}}</span>
        </div>
        <div class="clearfix text-grey font14">
          <span
            v-if="orderInfo.sex"
            class="special-border-right10 rel pr5"
          >{{sexFormat(orderInfo.sex)}}</span>
          <span v-if="orderInfo.age" class="special-border-right10 rel plr5">{{orderInfo.age}}岁</span>
          <span v-if="orderInfo.selfCare" class="rel plr5">{{selfCareFormat(orderInfo.selfCare)}}</span>
        </div>
      </div>
      <div class="mt10">
        <div class="my-template">
          <div class="title mb5">服务内容</div>
          <div class="simple font14">
            <span
              :class="['myicon', toggleTemplateDetail ? 'icon-down' : 'icon-top']"
              @click="toggleTemplateDetail=!toggleTemplateDetail"
            ></span>
            <div v-html="templateSimple" :class="{'toggle': toggleTemplateDetail}"></div>
          </div>
        </div>
        <mt-cell
          title="开始时间"
          v-if="orderInfo.realStartTime"
          :value="new Date(orderInfo.realStartTime).Format('yyyy年MM月dd日')"
        ></mt-cell>
        <div @click="showSelectedDate">
          <mt-cell title="服务天数" is-link :value="`${orderInfo.realNum||0}天`"></mt-cell>
        </div>
        <mt-cell title="联系人" :value="orderInfo.linkMan"></mt-cell>
        <mt-cell title="联系电话" :value="orderInfo.linkTelephone"></mt-cell>
        <!-- 绑定过腕带的展示更换腕带cell -->
        <mt-cell
          title="腕带"
          value="更换"
          class="mt10"
          @click.native="bindWrist(orderInfo.orderCode)"
          is-link
          v-if="orderInfo.wristBandStatus === 1"
        ></mt-cell>
        <mt-cell
          title="服务护工"
          class="mt10"
          value="更换"
          is-link
          v-if="orderInfo.distributeStatus === 1"
          @click.native="$router.push({ path: 'sendOrder', query: {orderId: currentOrderId}})"
        ></mt-cell>
        <mt-cell
          class="mt10"
          v-if="orderInfo.distributeStatus === 1 && orderInfo.serviceStatus===2&& role!=='2'"
          title="护理日志"
          is-link
          :to="{name:'serviceLog', query: {orderId: currentOrderId }}"
        ></mt-cell>

      </div>
    </div>
    <div class="footer center">
      <mt-button
        v-if="orderInfo.payTime < orderInfo.realEndTime && orderInfo.wristBandStatus != 1"
        size="large"
        class="my-btn btn-selected"
        type="primary"
        @click.native="bindWrist(orderInfo.orderCode)"
      >绑定腕带</mt-button>
      <mt-button
        v-if="orderInfo.distributeStatus === 0 && orderInfo.serviceStatus!==3"
        size="large"
        class="my-btn btn-selected has-border-left"
        type="primary"
        @click.native="$router.push({ path: 'sendOrder', query: {orderId: currentOrderId}})"
      >派单</mt-button>
    </div>
    <selected-date
      title="服务天数"
      pattern="view"
      v-model="selectedDateVisible"
      :data="orderInfo.serviceDates"
    ></selected-date>
  </div>
</template>

<script>
import { workOrderApi } from '@/assets/api'
import scanCode from './scanCode'
import utils from '@/utils/myUtils'
import selectedDate from '../order/popup/selectedDate'
export default {
  name: 'manageDetail',
  data () {
    return {
      role: utils.getItem('role'),
      templateSimple: '',
      toggleTemplateDetail: true,
      templateList: [],
      orderInfo: null,
      selectedDateVisible: false,
      currentOrderId: -1,
      serviceStatus: -1
    }
  },
  created () {
    this.currentOrderId = this.$route.query.orderId || -1
    // 初始化工单详情
    this.manageDetailInit()
    // 获取该工单的服务护工
  },
  components: {
    selectedDate
  },
  methods: {
    showSelectedDate () {
      this.selectedDateVisible = true
    },
    bindWrist (code) {
      scanCode.getwristbind(code, data => {
        // this.currentOrderId = -1
        // 代替router.go(0)
        // 页面初始化重新刷新一遍
        // this.$store.state.refreshNextPage = true
        this.$store.state.refreshNext.manageList = true
        this.$store.state.refreshNext.serviceTrack = true
        this.templateSimple = ''
        this.toggleTemplateDetail = true
        this.templateList = []
        this.orderInfo = null
        this.selectedDateVisible = false
        this.serviceStatus = -1
        this.manageDetailInit()
      })
    },
    manageDetailInit () {
      // 调接口获取订单详情
      workOrderApi.getWorkOrder(this.currentOrderId).then(data => {
        this.orderInfo = data.data.data
        // 得到服务状态
        this.serviceStatus = this.orderInfo.serviceStatus
        // 获取服务模板列表并拼接
        this.templateList = this.orderInfo.serviceItems
        let str = ''
        this.templateList.forEach((obj, index) => {
          str += `${index + 1}.${obj.serviceItemName}\n`
        })
        this.templateSimple = str.replace(/\n/g, '<br>')
      })
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
    }
  },
  filters: {
    getServiceStatus: function (value) {
      switch (value) {
        case 1:
          return '服务未开始'
        case 2:
          return '服务中'
        case 3:
          return '已结束'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="less" type="text/less">
.workorder-manageDetail {
  .mint-cell-value.is-link {
    margin-right: 15px;
  }
  .card {
    background-color: @background-white;
    div:first-child {
      position: relative;
      height: 28px;
      line-height: 28px;
      img {
        // position: absolute;
        height: 18px;
        width: 18px;
        margin-top: -5px;
      }
    }
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
  }
  .my-template {
    background-color: #fff;
    box-sizing: border-box;
    color: inherit;
    min-height: 77px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    box-shadow: inset 0px -0.5px 0px 0px rgba(141, 146, 158, 0.15);
    padding: @m15;
    .simple {
      position: relative;
      padding-right: 30px;
      color: @color-grey;
      .toggle {
        .line-clamp(1);
      }
      .myicon {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .tip {
    color: #3e4255;
  }
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52px;
  line-height: 52px;
  .flex();
  .my-btn {
    .flex-num(1);
    border-radius: 0;
  }
  .btn-selected {
    color: @background-white;
    background-color: @color-green;
  }
  .has-border-left:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -11px;
    width: 0;
    height: 22px;
    border-left: 0.5px solid rgba(209, 253, 255, 1);
  }
  .has-border-left-router:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -11px;
    width: 0;
    height: 22px;
    border-left: 0.5px solid @color-green;
  }
}
</style>
