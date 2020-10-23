<template>
  <mt-popup class="mint-msgbox approve-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div
        class="mint-msgbox-title"
        v-if="approvePopupObj.priceChangeHandleStatus === 1 && approvePopupObj.approve === 2"
      >
        <p class="mt5">确定拒绝本次改价申请吗？</p>
      </div>
      <div
        class="mint-msgbox-title"
        v-if="approvePopupObj.priceChangeHandleStatus === 1 && approvePopupObj.approve === 1"
      >
        <p class="mb15">
          <span
            class="myFont-DINPro-Medium font18 pr10"
          >&yen;{{((approvePopupObj.sumPrice/100)).toFixed(2)}}</span>
          <i class="myicon icon_flight"></i>
          <span
            class="myFont-DINPro-Medium font18 pl10 text-red"
          >&yen;{{((approvePopupObj.changePrice/100)).toFixed(2)}}</span>
        </p>
        <p class="mt5">确定同意本次改价申请吗？</p>
      </div>
      <div
        class="mint-msgbox-title"
        v-if="approvePopupObj.payStatus === 3 && approvePopupObj.approve === 2"
      >
        <p class="mt5">确定拒绝本次退款申请吗？</p>
      </div>
      <div
        class="mint-msgbox-title"
        v-if="approvePopupObj.payStatus === 3 && approvePopupObj.approve === 1"
      >
        <p class="mb15">
          <i class="myicon icon_refund"></i>
          <span
            class="myFont-DINPro-Medium font18 pl10 text-red"
          >退除&yen;{{(approvePopupObj.careOrderRefund && approvePopupObj.careOrderRefund.realRefundSumPrice/100 || 0).toFixed(2)}}</span>
        </p>
        <p class="mt5">确定同意本次退款申请吗？</p>
      </div>
    </div>
    <div class></div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">确定</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'
export default {
  data () {
    return {
      note: '',
      stars: [true, true, true, true, true],
      price: null
    }
  },
  props: {
    visible: {
      default: true
    },
    approvePopupObj: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (this.approvePopupObj.priceChangeHandleStatus === 1) {
        // 改价
        this.wxPriceChangeApprove(
          this.approvePopupObj.orderPriceRevisionId,
          this.approvePopupObj.approve
        )
      }
      if (this.approvePopupObj.payStatus === 3) {
        // 退款
        this.refundApprove(
          this.approvePopupObj.id,
          this.approvePopupObj.approve
        )
      }
    },
    // 退款 approve：1（批准）/2（拒绝）
    refundApprove (id, approve) {
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      this.$Indicator.open({
        text: '处理中...',
        spinnerType: 'fading-circle'
      })
      orderApi
        .refundApprove(id, approve)
        .then(json => {
          this.$Toast({
            message: '操作成功',
            duration: 2000
          })
          this.$emit('update:visible', false) // 弹窗关闭
          this.approvePopupObj.payStatus = approve === 1 ? 4 : 2
          this.$emit('approveOk', this.approvePopupObj)
        })
        .catch(e => {
          this.$Toast({
            message: '操作失败:' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true) // 放开按钮
          this.$Indicator.close()
        })
    },
    wxPriceChangeApprove (id, approve) {
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      this.$Indicator.open({
        text: '处理中...',
        spinnerType: 'fading-circle'
      })
      orderApi
        .wxPriceChangeApprove(id, approve)
        .then(json => {
          this.$Toast({
            message: '操作成功',
            duration: 2000
          })
          this.$emit('update:visible', false) // 弹窗关闭
          this.approvePopupObj.priceChangeHandleStatus = 0
          this.$emit('approveOk', this.approvePopupObj)
        })
        .catch(e => {
          this.$Toast({
            message: '操作失败:' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true) // 放开按钮
          this.$Indicator.close()
        })
    }
  }
}
</script>

<style lang="less">
.approve-popup {
  .mint-msgbox-title {
    border-bottom: 1px solid #f8f8f8;
    padding: 20px 0 35px 0;
    .myicon {
      height: 22px;
      width: 18px;
      background-size: 100% auto;
      background-repeat: no-repeat;
    }
    .icon_flight {
      background-image: url("../../../assets/imgs/order/icon_flight.png");
    }
    .icon_refund {
      background-image: url("../../../assets/imgs/order/icon_refund.png");
    }
  }
}
</style>
