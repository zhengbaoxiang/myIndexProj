<template>
  <div class="workorder-manageList">
    <my-header title="工单管理"></my-header>
    <div class="manage-body">
      <mt-loadmore
        :top-method="pageReload"
        :auto-fill="false"
        ref="workOrderLoadmoreRef"
      >
        <ul
          v-infinite-scroll="getWorkOrders"
          infinite-scroll-distance="10"
          infinite-scroll-disabled="loading"
          style="min-height:400px"
        >
          <li
            class="mb15 manageitem"
            v-for="(item, index) in manageList"
            :key="index"
          >
            <div class="manage-top ptb20">
              <div @click="toDetail(item)">
                <ul>
                  <li class="clearfix">
                    <span class="fl font20">{{ item.bedName }}</span>
                    <div class="ml5 fl">
                      <mt-badge size="small">{{ item.districtName }}</mt-badge>
                    </div>
                    <img
                      class="ml5"
                      :src="
                        require(item.deviceStatus
                          ? '../../assets/imgs/belled.png'
                          : '../../assets/imgs/unbell.png')
                      "
                    />
                    <img
                      class="ml5"
                      :src="
                        require(item.wristBandStatus != 1
                          ? '../../assets/imgs/unwristBand.png'
                          : '../../assets/imgs/wristBand.png')
                      "
                    />
                    <span
                      class="fr font14"
                      :class="{
                        'text-green': item.serviceStatus === 2,
                        'text-grey':
                          item.serviceStatus === 1 || item.serviceStatus == 3
                      }"
                      >{{ item.serviceStatus | getServiceStatus }}</span
                    >
                  </li>
                  <li class="clearfix mt10">
                    <span class="fl">{{ item.patientName }}</span>
                    <span class="fr">{{ item.productBigTitle }}</span>
                  </li>
                  <li class="clearfix text-grey font14">
                    <span
                      v-if="item.sex"
                      class="special-border-right10 rel pr5"
                      >{{ sexFormat(item.sex) }}</span
                    >
                    <span
                      v-if="item.age"
                      class="special-border-right10 rel plr5"
                      >{{ item.age }}岁</span
                    >
                    <span v-if="item.selfCare" class="rel plr5">{{
                      selfCareFormat(item.selfCare)
                    }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="manage-bottom clearfix"
              v-if="
                (item.payTime &&
                  item.realEndTime &&
                  item.payTime &&
                  item.payTime > item.realEndTime) ||
                  item.wristBandStatus != 1 ||
                  item.distributeStatus === 0
              "
            >
              <div class="fr">
                <mt-badge
                  size="small"
                  v-if="
                    item.payTime &&
                      item.realEndTime &&
                      item.payTime > item.realEndTime
                  "
                  >订单过期！请及时联系患者退款</mt-badge
                >
                <template v-else>
                  <mt-button
                    v-if="item.wristBandStatus != 1"
                    class="ml5 small-button"
                    size="small"
                    type="primary"
                    @click.native="bindWrist(item.orderCode)"
                    >绑定腕带</mt-button
                  >
                  <mt-button
                    v-if="
                      item.distributeStatus === 0 && item.serviceStatus !== 3
                    "
                    class="ml5 small-button"
                    size="small"
                    type="primary"
                    @click.native="
                      $router.push({
                        path: 'sendOrder',
                        query: { orderId: item.orderId }
                      })
                    "
                    >派单</mt-button
                  >
                </template>
              </div>
            </div>
          </li>
        </ul>
      </mt-loadmore>
      <div
        v-show="allLoaded && manageList.length === 0"
        class="noOrders center"
      >
        <img src="../../assets/imgs/noOrders.png" alt />
        <div class="word">暂无工单</div>
      </div>
    </div>
    <my-tabbar current="工单" />
  </div>
</template>
<script>
import { workOrderApi } from '@/assets/api'
import scanCode from './scanCode'
export default {
  name: 'manageList',
  data () {
    return {
      redirect: this.$route.query.redirect,
      loading: false,
      allLoaded: false,
      manageList: [],
      page: {
        pageSize: 10,
        pageNo: 0
      }
    }
  },
  created () {},
  activated () {
    this.loading = false
    if (this.$store.state.refreshNext.manageList) {
      // 详情页
      this.$store.state.refreshNext.manageList = false
      this.pageReload()
    }
  },
  methods: {
    toDetail (item) {
      this.loading = true
      this.$router.push({
        name: 'manageDetail',
        query: { orderId: item.orderId }
      })
    },
    getWorkOrders () {
      if (this.loading) return
      this.loading = true
      this.page.pageNo = ++this.page.pageNo
      workOrderApi
        .getWorkOrders(this.page.pageSize, this.page.pageNo)
        .then((data) => {
          if (data.data.data.list.length > 0) {
            this.manageList.push(...data.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          // 全部加载完成
          this.allLoaded = this.manageList.length >= data.data.data.total
        })
        .finally(() => {
          // 还有数据允许继续触发上滑加载更多。
          if (!this.allLoaded) {
            this.loading = false
          }
          this.$refs.workOrderLoadmoreRef.onTopLoaded()
        })
    },
    bindWrist (code) {
      scanCode.getwristbind(code, (data) => {
        // 代替router.go(0)
        // 页面初始化重新刷新一遍
        // this.$store.state.refreshNextPage = true
        this.$store.state.refreshNext.serviceTrack = true
        this.pageReload()
      })
    },
    // 页面数据重新加载方法
    pageReload () {
      this.manageList = []
      this.page = {
        pageSize: 10,
        pageNo: 0
      }
      this.loading = false
      this.allLoaded = false
      this.getWorkOrders()
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
.workorder-manageList {
  .manage-body {
    padding: 15px 15px 65px 15px;
    .manageitem {
      background-color: @color-white;
      box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
      overflow: hidden;
      .border_radius();
      .manage-top {
        padding-left: @m15;
        padding-right: @m15;
        color: rgba(62, 66, 85, 1);
        li:first-child {
          height: 28px;
          line-height: 28px;
          position: relative;
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
      .manage-bottom {
        position: relative;
        padding: @m15;
        background-color: @color-white;
        color: @color-default;
        .small-button {
          background-color: @color-green;
          color: @color-white;
        }
        .mint-badge.is-size-small {
          background-color: rgba(242, 121, 103, 0.08);
          color: rgba(242, 121, 103, 1);
        }
        &::before {
          content: '';
          border-top: 0.5px solid @border-color;
          position: absolute;
          top: -1px;
          left: 0;
          width: 100%;
          transform: scaleY(0.5);
        }
      }
    }
    .loading {
      text-align: center;
      width: 100px;
      margin: @m5 auto 0 auto;
      .word {
        vertical-align: 0;
        margin-left: @m5;
      }
    }
    .noOrders {
      position: absolute;
      top: 150px;
      pointer-events: none;
      z-index: -1;
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
}
</style>
