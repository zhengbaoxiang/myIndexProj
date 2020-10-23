<template>
  <div class="service-list">
    <my-header :title="selectService ? '选择服务' : '护理套餐'"></my-header>
    <div>
      <div class="title">基础护理</div>
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="notScroll"
      >
        <li class="mtb10 item" v-for="(item, index) in serviceList" :key="index">
          <div v-if="selectService" @click="cellSelected(item)">
            <a>
              <span class="fl mt15 ml15">{{item.bigTitle}}</span>
              <div class="ml15 simple" style="clear:both">{{item.smallTitle}}</div>
              <div class="info ml15 mb15">
                <span class="myFont-DINPro-Medium">&yen; {{item.realPrice | priceFilters}}</span>
                <span v-if="item.kind === 1">/{{periodFormat(item.period)}}</span>
                <mt-badge size="small" class="allin-price-badge" v-if="item.kind === 2">全包价</mt-badge>
              </div>
            </a>
            <mt-button class="subscribe">选择</mt-button>
          </div>
          <template v-else>
            <router-link :to="{name:'serviceDetail',query:{serviceId : item.id}}">
              <span class="fl mt15 ml15">{{item.bigTitle}}</span>
              <div class="ml15 simple" style="clear:both">{{item.smallTitle}}</div>
              <div class="info ml15 mb15">
                <span class="myFont-DINPro-Medium">&yen; {{item.realPrice | priceFilters}}</span>
                <span v-if="item.kind === 1">/{{periodFormat(item.period)}}</span>
                <mt-badge size="small" class="allin-price-badge" v-if="item.kind === 2">全包价</mt-badge>
              </div>
            </router-link>
            <router-link :to="'/order/confirm?serviceId='+ item.id">
              <mt-button class="subscribe">预约</mt-button>
            </router-link>
          </template>
        </li>
      </ul>
      <div v-show="loading" class="loading">
        <mt-spinner style="float: left" type="fading-circle" :size="20"></mt-spinner>
        <span class="word">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { homeApi } from '@/assets/api'
export default {
  name: 'serviceList',
  data () {
    return {
      selectService: false,
      serviceList: [],
      hospitalId: null,
      loading: false,
      notScroll: true,
      page: {
        pageSize: 10,
        pageNo: 0
      },
      campus: {}
    }
  },
  created () {
    this.loadList()
    if (this.$route.query.select) {
      this.selectService = true
    }
  },
  methods: {
    loadMore () {
      this.loading = true
      this.notScroll = true
      this.loadList()
    },
    loadList: function () {
      this.hospitalId =
        this.$route.query.hospitalId ||
        this.hospitalId ||
        window.localStorage.getItem('hospitalID')
      this.page.pageNo = ++this.page.pageNo
      homeApi
        .serviceList(this.hospitalId, this.page.pageNo, this.page.pageSize)
        .then(response => {
          if (response.data.data.list.length > 0) {
            this.serviceList.push(...response.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          if (response.data.data.list.length === this.page.pageSize) {
            this.notScroll = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    periodFormat: function (period) {
      return window.hcsConfig.periodList[period]
    },
    cellSelected (item) {
      var _orderInfo = this.$store.state.orderInfo
      _orderInfo.serviceId = item.id
      _orderInfo.serviceName = item.bigTitle
      _orderInfo.priceKind = item.kind
      _orderInfo.serviceRealPrice = item.realPrice
      this.$store.commit('setOrderInfo', _orderInfo)
      this.$router.go(-1)
    }
  },
  filters: {
    priceFilters: function (value) {
      return (value / 100).toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
.service-list {
  padding: @m15;
  .title {
    color: rgba(141, 146, 158, 1);
    font-size: @font-size-normal;
    text-align: left;
  }
  .item {
    height: 130px;
    background-color: @color-white;
    border: 0.5px solid rgba(236, 236, 243, 1);
    border-radius: 5px;
    box-shadow: 0px 1px 3px 0px rgba(16, 47, 163, 0.07);
    position: relative;
    background-image: url("../../assets/imgs/service_list@2x.png");
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    a {
      display: block;
      height: 100%;
    }
    span {
      // color: rgba(62, 66, 85, 1);
      font-size: @font-size-normal;
      text-align: center;
    }
    .simple {
      color: rgba(141, 146, 158, 1);
      font-size: @font-size-small;
      width: 196px;
      .line-clamp(2);
    }
    .info {
      position: absolute;
      left: 0;
      bottom: 0;
      color: rgba(225, 129, 114, 1);
      font-size: @font-size-normal;
      .allin-price-badge {
        height: 14px;
        line-height: 14px;
        font-size: 10px;
        padding: 0px 5px;
        border-radius: 100px 100px 100px 0;
        background-color: rgba(242, 121, 103, 1);
        margin-left: 2px;
        float: right;
        margin-top: 2px;
      }
    }
    .subscribe {
      position: absolute;
      top: 49px;
      right: 15px;
      width: 68px;
      height: 30px;
      border-radius: 1px;
      background-color: @color-green;
      color: @color-white;
      font-size: @font-size-small;
      text-align: center;
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
}
</style>
