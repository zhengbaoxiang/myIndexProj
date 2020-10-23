<template>
  <mt-popup class="mint-msgbox pay-popup" v-model="visibled">
    <div class="title">
      <div class="mint-cell-wrapper wx-pay" @click="wxpay">
        <div class="mint-cell-title">
          <span class="mint-cell-text">微信支付(推荐)</span>
        </div>
      </div>
      <div class="mint-cell-wrapper offline-pay" @click="offlinePay">
        <div class="mint-cell-title">
          <span class="mint-cell-text">现金支付</span>
        </div>
      </div>
    </div>
  </mt-popup>
</template>
<script>
export default {
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    }
  },
  data () {
    return {
      visibled: false
    }
  },
  watch: {
    visible (newval, oldval) {
      console.log('visible', newval)
      this.visibled = newval
    },
    visibled (newval, oldval) {
      console.log('visibled', newval)
      if (!newval) {
        this.$emit('update:visible', false)
      }
    }
  },
  methods: {
    // payOk : 1表示微信支付 2表示线下付款
    wxpay () {
      console.log('wxpay')
      this.$emit('payOk', 1)
      this.$emit('update:visible', false)
    },
    offlinePay () {
      console.log('offlinePay')
      this.$emit('payOk', 2)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less">
.pay-popup {
  overflow: visible;
  .mint-cell-wrapper {
    height: 52px;
    background-position: 20px center;
    background-size: 16px auto;
    background-repeat: no-repeat;
    position: relative;
    padding: 0 15px 0 20px;
    .mint-cell-text {
      margin-left: 21px;
      color: @color-default;
      font-size: @font-size-normal;
    }
  }
  .wx-pay {
    background-image: url("../../../assets/imgs/wxPay@2x.png");
  }
  .offline-pay {
    background-image: url("../../../assets/imgs/offlinePay@2x.png");
    border-top: 1px solid #f8f8f8;
  }
}
</style>
