<template>
  <div class="order-pay">
    <my-header title="确认订单"></my-header>
    <div v-if="orderDetail">
      <mt-cell :title="orderDetail.linkMan" :value="orderDetail.linkTelephone">
        <i slot="icon" class="headpic"></i>
      </mt-cell>
      <div class="mt10">
        <div class="mint-cell my-product">
          <div class="title">{{orderDetail.productBigTitle}}</div>
          <div class="simple font14">
            <!-- <span
              :class="['myicon', toggleProductDetail ? 'icon-down' : 'icon-top']"
              @click="toggleProductDetail=!toggleProductDetail"
            ></span>-->
            <!-- <div v-html="productSimple" :class="{'toggle': toggleProductDetail}"></div> -->
          </div>
        </div>
        <mt-cell title="被护理人" :value="orderDetail.patientName"></mt-cell>
        <mt-cell title="开始时间" :value="new Date(orderDetail.realStartTime).Format('yyyy年MM月dd日')"></mt-cell>
        <mt-cell v-if="orderDetail.priceKind === 1" title="服务天数" :value="`${orderDetail.realNum}天`"></mt-cell>
        <mt-cell title="服务医院" :value="orderDetail.campusName"></mt-cell>
        <mt-cell title="科室/病区" :value="orderDetail.districtName"></mt-cell>
        <mt-cell title="床位" :value="orderDetail.bedName"></mt-cell>
      </div>
      <div class="fixed bottom">
        <p
          class="fl myFont-DINPro-Medium font18 price"
        >&yen; {{( orderDetail.sumPrice / 100 || 0).toFixed(2)}}</p>
        <mt-button class="fr" type="primary" @click="gopay">去支付</mt-button>
        <mt-button class="fr offline" type="primary" @click="offlinePayShow = true">线下付款</mt-button>
      </div>
      <offline-popup :visible.sync="offlinePayShow" :orderId="orderId" @offlinePayOk="offlinePayOk"></offline-popup>
    </div>
  </div>
</template>

<script>
import { orderApi, homeApi } from '@/assets/api'
import { Indicator } from 'mint-ui'
import offlinePopup from './popup/offlinePopup'
import orderPay from '@/utils/pay'
export default {
  name: 'orderPay',
  data () {
    return {
      orderId: -1,
      orderDetail: null,
      productSimple: '',
      toggleProductDetail: true,
      wxParams: {},
      offlinePayShow: false
    }
  },
  components: {
    offlinePopup
  },
  created () {
    this.orderId = this.$route.query.orderId
    this.getData(this.orderId)
  },
  methods: {
    async getData (orderId) {
      await orderApi
        .getOrderDetail(orderId)
        .then(data => {
          if (
            data.data.data.payStatus !== 1 &&
            data.data.data.payStatus !== 7
          ) {
            this.$MessageBox.alert('订单状态无需支付！！').then(() => {
              window.location.href =
                window.hcsConfig.domain + '/order/list?default=user'
            })
            return
          }
          this.orderDetail = data.data.data
        })
        .catch(e => {
          this.$MessageBox.alert('订单数据异常，请稍后重试！！').then(() => {
            this.$router.go(-1)
          })
        })
      homeApi.serviceDetail(this.orderDetail.serviceId).then(json => {
        this.productSimple = json.data.data.simple
      })
    },
    // 去支付
    async gopay () {
      orderPay.wxpay(this.orderId)
    },
    offlinePayOk () {
      Indicator.open('正在为您自动跳转...')
      let time = 2
      var thisTimer = setInterval(() => {
        time--
        if (time < 0) {
          Indicator.close()
          clearInterval(thisTimer)
          window.location.href =
            window.hcsConfig.domain + '/order/list?default=user'
        }
      }, 500)
    }
  }
}
</script>

<style lang="less">
.order-pay {
  .headpic {
    display: inline-block;
    vertical-align: middle;
    background: url("../../assets/imgs/order_user.png") no-repeat center center;
    background-size: auto 100%;
    height: 20px;
    width: 20px;
    margin-right: 3px;
  }
  .my-product {
    padding: 15px;
    .title {
      font-weight: bold;
    }
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
  .mint-cell-text {
    color: @color-grey;
  }
  .mint-cell-value {
    color: @color-default;
  }
  .bottom {
    width: 100%;
    height: 52px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: inset 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1);
    .mint-button {
      height: 52px;
      line-height: 52px;
      border-radius: 0;
      width: 104px;
    }
    .offline {
      color: @color-green;
      background-color: rgba(255, 255, 255, 1);
      border: 0.5px solid rgba(0, 0, 0, 0.1);
    }
  }
  .price {
    color: @color-default;
    line-height: 52px;
    padding-left: 15px;
  }
}
</style>
