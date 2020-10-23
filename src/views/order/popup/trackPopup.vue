<template>
  <mt-popup class="mint-msgbox track-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div class="mint-msgbox-title title">请确认已收到钱款</div>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">确定</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'
// import utils from '@/utils/myUtils'

export default {
  data () {
    return {}
  },
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    },
    oldPrice: {
      default: 0
    }
  },
  computed: {},
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (!this.$store.state.submit) {
        return
      }
      // 锁定支付按钮
      this.$store.commit('setSubmit', false)
      orderApi
        .pay({ id: this.orderId })
        .then(response => {
          this.$emit('trackOk', this.orderId)
          this.$emit('update:visible', false)
          this.$Toast({
            message: '收款成功!',
            duration: 2000
          })
        })
        .catch(e => {
          this.$Toast({
            message: '操作失败:' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          setTimeout(() => {
            this.$store.commit('setSubmit', true)
          }, 300)
        })
    }
  }
}
</script>

<style lang="less">
.track-popup {
  .title {
    border-bottom: 1px solid #f8f8f8;
    padding: 20px 0 35px 0;
  }
}
</style>
