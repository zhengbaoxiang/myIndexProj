<template>
  <mt-popup class="mint-msgbox end-order-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div class="mint-msgbox-title title">
        <p class="mt15">确定结束订单吗?</p>
      </div>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">结单</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    },
    canChangePrice: {
      default: false
    }
  },
  data () {
    return {
      changePriceFlag: false,
      changePriceObj: {
        orderId: -1,
        changePrice: null,
        changeReason: '',
        languageIdList: []
      },
      options: []
    }
  },
  computed: {
    noteTips () {
      if (
        this.changePriceFlag &&
        utils.trim(this.changePriceObj.changeReason) === '' &&
        this.changePriceObj.languageIdList.length === 0
      ) {
        return '请填写改价理由后提交'
      }
      return false
    },
    priceTips () {
      if (
        this.changePriceFlag &&
        (isNaN(this.changePriceObj.changePrice) ||
          this.changePriceObj.changePrice === null ||
          this.changePriceObj.changePrice < 0)
      ) {
        return '请填写修改价格'
      }
      return false
    }
  },
  // created () {
  //   this.getCommonLanguage()
  // },
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (this.priceTips) {
        this.$MessageBox.alert(this.priceTips)
        return
      }
      if (this.noteTips) {
        this.$MessageBox.alert(this.noteTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      // 在这里调用结束订单接口
      console.log('this.orderId', this.orderId)
      if (!this.canChangePrice) {
        this.endOrder()
      } else {
        this.$store.commit('setSubmit', true)
        this.$emit('update:visible', false)
        this.$emit('needChangePrice', this.orderId)
      }
    },
    endOrder () {
      orderApi
        .endOrder(this.orderId, 0)
        .then((response) => {
          // 调用改价
          this.$emit('endOk', this.orderId)
          this.$Toast({
            message: '结束订单成功!',
            duration: 2000
          })
        })
        .catch((e) => {
          this.$Toast({
            message: '结束订单失败，' + e.data.errmsg,
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
.end-order-popup {
  .title {
    border-bottom: 1px solid #f8f8f8;
    padding: 20px 0 35px 0;
  }
}
</style>
