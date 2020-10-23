<template>
  <mt-popup class="mint-msgbox offlineApply-popup" v-model="visible" :closeOnClickModal="false">
    <div class="title">
      <img src="../../../assets/imgs/offline.png" />
      <div class="text-default">该订单将使用线下付款</div>
      <div class="font14 text-grey mt10">付款完成后，记得向工作人员索要收据哦</div>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">确定</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'

export default {
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    }
  },
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      orderApi
        .offlinePay(this.orderId)
        .then(response => {
          this.$emit('offlinePayOk')
        })
        .catch(e => {
          this.$Toast({
            message: '线下支付失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$emit('update:visible', false)
          this.$store.commit('setSubmit', true)
        })
    }
  }
}
</script>

<style lang="less">
.offlineApply-popup {
  overflow: visible;
  .title {
    position: relative;
    text-align: center;
    padding-bottom: 35px;
    padding-top: 124px;
    border-bottom: 1px solid #f8f8f8;
    img {
      position: absolute;
      width: 100%;
      top: -25%;
      left: 0;
    }
  }
}
</style>
