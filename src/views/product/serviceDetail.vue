<template>
  <div class="service-detail">
    <my-header title="套餐详情"></my-header>
    <div class="pb65">
      <div class="card">
        <div class="font18 card-name">{{card.bigTitle}}</div>
        <div class="font14 card-simple">{{card.smallTitle}}</div>
        <div class="font18 card-price myFont-DINPro-Medium">
          <span>&yen;{{card.realPrice | priceFilters}}</span>
          <span v-if="card.kind === 1">/{{periodFormat(card.period)}}</span>
        </div>
      </div>
      <div class="line-num">截止目前为止，已有 {{personNum}} 人预约该项服务</div>
      <div class="serviceItems bg-white pt15">
        <ul class="clearfix">
          <li v-for="(item, index) in serviceItem" :key="index">
            <div>
              <img :src="item.img" alt />
            </div>
            <div class="mt5">{{ item.title }}</div>
          </li>
        </ul>
      </div>
      <div class="serviceContent mt10">
        <div class="liveNavBarOut">
          <mt-navbar
            class="liveNavBar bg-white plr15"
            :class="{'navbarFixed' : this.navbarFixed}"
            v-model="selected"
          >
            <mt-tab-item id="1">服务内容</mt-tab-item>
            <mt-tab-item id="2">用户评价</mt-tab-item>
          </mt-navbar>
        </div>
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <div class="serviceDes bg-white plr15 pb15" v-html="detail"></div>
            <div class="mt10 plr15 pb15" v-if="tips">
              <span class="font14">温馨提示</span>
              <div class="font12 text-grey" v-html="tips"></div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <div v-if="needShow" class="bg-white plr15 pb5">
              <div class="serviceDess center" v-if="evaluation.list && evaluation.list.length > 0">
                <i class="myicon star fill" v-for="n in avgEvaluateInt" :key="n"></i>
                <i class="myicon star" v-for="m in (5 - avgEvaluateInt)" :key="m"></i>
                <p class="mt5">{{ evaluation.avgEvaluate}}</p>
              </div>
              <div v-else class="serviceDess center">
                <i class="myicon star" v-for="m in 5" :key="m"></i>
                <p class="mt5">暂无评价</p>
              </div>
              <div class="labels font12" v-if="this.appraiseTipList.length>0">
                <ul class="labels_item center" v-for="(item,index) in appraiseTipList" :key="index">
                  <li>{{item.label}}({{item.num &gt; 999 ? '999+' : item.num}})</li>
                </ul>
                <div class="clearfloat"></div>
              </div>
              <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-distance="10"
                infinite-scroll-disabled="notScroll"
              >
                <li class="appraise" v-for="(item, index) in evaluation.list" :key="index">
                  <div class="clearfix">
                    <span class="fl">{{item.telephone}}</span>
                    <span class="fr text-grey font12">{{item.dealTime | getDate}}</span>
                  </div>
                  <div>
                    <i class="myicon star star-small fill" v-for="n in item.evaluate1" :key="n"></i>
                    <i class="myicon star star-small" v-for="m in (5 - item.evaluate1)" :key="m"></i>
                  </div>
                  <div class="mt5 font14">{{item.evaluate}}</div>
                </li>
              </ul>
              <div v-show="loading" class="loading">
                <mt-spinner style="float: left" type="fading-circle" :size="20"></mt-spinner>
                <span class="word">加载中...</span>
              </div>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
    <div class="bottom fixed">
      <router-link :to="{ path: '/order/confirm', query: { serviceId }}">
        <mt-button type="primary" size="large">预 约</mt-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { homeApi } from '@/assets/api'
export default {
  data () {
    return {
      serviceId: '',
      selected: '1',
      needShow: false,
      personNum: 0,
      navbarFixed: false,
      card: {
        name: '',
        simple: '',
        realPrice: '',
        period: 0,
        kind: 0
      },
      serviceItem: [
        {
          img: require('../../assets/imgs/servicedetail-attestation.png'),
          title: '实名认证'
        },
        {
          img: require('../../assets/imgs/servicedetail-health.png'),
          title: '健康证明'
        },
        {
          img: require('../../assets/imgs/servicedetail-train.png'),
          title: '专业培训'
        },
        {
          img: require('../../assets/imgs/servicedetail-supervise.png'),
          title: '全程监督'
        },
        {
          img: require('../../assets/imgs/servicedetail-ensure.png'),
          title: '售后保障'
        }
      ],
      period: 0,
      detail: '',
      tips: '',
      evaluation: {
        avgEvaluate: 0,
        list: []
      },
      appraiseTipList: [],
      page: {
        pageSize: 10,
        pageNo: 0
      },
      notScroll: false,
      loading: false
    }
  },
  computed: {
    avgEvaluateInt: function () {
      return Math.ceil(this.evaluation.avgEvaluate)
    }
  },
  created () {
    // 获取套餐服务ID
    this.serviceId = this.$route.query.serviceId

    // 套餐详情 数据源初始化
    this.serviceDetailInIt()
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('touchmove', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('touchmove', this.handleScroll)
  },
  methods: {
    // 套餐详情 （ 含历史订单数量）
    serviceDetailInIt () {
      homeApi
        .serviceDetail(this.serviceId)
        .then(json => {
          if (json.data.errcode === '0000') {
            this.card.bigTitle = json.data.data.bigTitle
            this.card.smallTitle = json.data.data.smallTitle
            this.card.realPrice = json.data.data.realPrice
            this.card.period = json.data.data.period
            this.card.kind = json.data.data.kind
            this.personNum = json.data.data.personNum
            this.detail = json.data.data.detail
            this.tips = json.data.data.tips
          }
        })
        .catch(e => {})
    },
    // 套餐详情查评价
    evaluateListInit () {
      this.page.pageNo = ++this.page.pageNo
      homeApi
        .evaluateList(this.serviceId, this.page.pageSize, this.page.pageNo)
        .then(json => {
          if (json.data.errcode === '0000') {
            if (this.page.pageNo === 1) {
              this.evaluation.avgEvaluate = json.data.data.avgEvaluate
              this.appraiseTipList = json.data.data.labelVOs
            }

            if (
              json.data.data &&
              json.data.data.list &&
              json.data.data.list.length > 0
            ) {
              this.evaluation.list.push(...json.data.data.list)
            } else {
              this.page.pageNo = --this.page.pageNo
            }

            if (
              json.data.data &&
              json.data.data.list &&
              json.data.data.list.length === this.page.pageSize
            ) {
              this.notScroll = false
            } else {
              this.notScroll = true
            }
          }
        })
        .catch(e => {})
        .finally(() => {
          this.loading = false
        })
    },
    // 分页加载
    loadMore () {
      this.loading = true
      this.notScroll = true

      // 套餐详情查评价
      this.evaluateListInit()
    },
    // 滚动事件
    handleScroll () {
      let scrollHeight = 146 + 20 + 70 + 10
      // let liveNavBar = document.querySelector('.liveNavBar')
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      console.log('scrollTop=', scrollTop)
      console.log('scrollHeight=', scrollHeight)
      if (scrollTop < scrollHeight) {
        this.navbarFixed = false
      } else {
        this.navbarFixed = true
      }
      // if (/android/i.test(navigator.userAgent)) {
      //   if (scrollTop < scrollHeight) {
      //     liveNavBar && (liveNavBar.style.position = 'relative')
      //     liveNavBar && (liveNavBar.className = 'mint-navbar liveNavBar plr15')
      //     Array.prototype.forEach.call(
      //       document.querySelectorAll('.serviceDes'),
      //       function (el) {
      //         el.style.marginTop = '0px'
      //       },
      //       this
      //     )
      //   } else {
      //     liveNavBar && (liveNavBar.style.position = 'fixed')
      //     liveNavBar &&
      //       (liveNavBar.className = 'mint-navbar liveNavBar live plr15')
      //     Array.prototype.forEach.call(
      //       document.querySelectorAll('.serviceDes'),
      //       function (el) {
      //         el.style.marginTop = '50px'
      //       },
      //       this
      //     )
      //   }
      // }
      // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   liveNavBar && (liveNavBar.style.position = 'sticky')
      //   if (scrollTop < scrollHeight) {
      //     liveNavBar && (liveNavBar.style.top = '0')
      //   } else {
      //     liveNavBar && (liveNavBar.style.top = '36px')
      //   }
      // }
    },
    periodFormat: function (period) {
      return window.hcsConfig.periodList[period]
    }
  },
  filters: {
    getDate: function (value) {
      if (value) {
        var time = new Date(value)
        var yy = time.getFullYear()
        var mm = time.getMonth() + 1
        mm = mm < 10 ? '0' + mm : mm
        var dd = time.getDate()
        dd = dd < 10 ? '0' + dd : dd
        return yy + '年' + mm + '月' + dd + '日'
      } else {
        return ''
      }
    },
    priceFilters: function (value) {
      return (value / 100).toFixed(2)
    }
  },

  watch: {
    selected (currentValue) {
      if (currentValue === '2') {
        this.needShow = true
      }
    }
  }
}
</script>

<style lang="less" type="text/less">
.service-detail {
  .liveNavBarOut {
    position: relative;
    height: 50px;
  }
  .liveNavBar {
    z-index: 9;
  }
  .liveNavBar.navbarFixed {
    position: fixed;
    top: 35px;
    width: calc(100% - @m15 * 2);
    background-color: @background-white;
  }
  .serviceDes {
    padding: @m15 @m15 @m15 @m15;
    h4 {
      margin-top: @m10;
    }
    p {
      font-size: 14px;
    }
  }
  .serviceDess {
    padding: @m15 @m15 0 @m15;
    h4 {
      margin-top: @m10;
    }
    p {
      font-size: 14px;
    }
  }

  .labels {
    min-height: 30px;
    .labels_item {
      background-color: #fcecb5;
      color: #cca727;
      width: 30%;
      float: left;
      margin: @m10 @m10 0 0;
      line-height: 16px;
    }
  }
  .clearfloat {
    clear: both;
    height: 0;
    font-size: 1px;
    line-height: 0px;
  }
  .card {
    height: 146px;
    text-align: center;
    background: url("../../assets/imgs/bg-servicedetail.png") no-repeat;
    background-size: 100% 100%;
    color: @color-white;
    overflow: hidden;
    .card-name {
      margin-top: 35px;
    }
    .card-simple {
      margin: 5px auto 15px;
      opacity: 0.75;
      width: 80%;
      .line-clamp(1);
    }
    .card-price {
      margin-bottom: 28px;
    }
  }
  .line-num {
    height: 20px;
    line-height: 20px;
    background-color: @background-yellow;
    color: @color-yellow;
    text-align: center;
    font-size: @font-size-mini;
  }
  .serviceItems {
    height: 55px;
    font-size: @font-size-mini;
    text-align: center;
    color: @color-grey;
    li {
      float: left;
      width: 20%;
    }
    img {
      width: 24px;
    }
  }
  .serviceContent {
    li.appraise {
      background-color: rgba(197, 208, 224, 0.15);
      padding: @m10;
      margin-top: @m10;
    }
    .star {
      margin-right: 10px;
    }
    .star-small {
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
  .mint-navbar {
    position: relative;
    display: block;
    height: 50px;
  }
  .mint-navbar::after {
    content: "";
    border-bottom: 1px solid @border-color;
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    transform: scaleY(0.5);
    clear: both;
  }
  .mint-navbar .mint-tab-item {
    padding: 0;
    font-size: 16px;
    float: left;
    margin-right: 20px;
  }

  .mint-tab-item-label {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
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
  .bottom {
    z-index: 10;
  }
}
</style>
