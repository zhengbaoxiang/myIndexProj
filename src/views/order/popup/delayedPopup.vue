<template>
  <mt-popup class="mint-msgbox delayed-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div class="mint-msgbox-title title">该订单将延迟付款</div>
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
      // 模拟成功-----------------
      // this.$emit("delayOk", this.orderId);
      // this.$emit("update:visible", false);
      // this.$Toast({
      //   message: "延期成功!",
      //   duration: 2000
      // });
      this.$store.commit('setSubmit', false)
      orderApi
        .payDelay(this.orderId)
        .then(response => {
          this.$emit('delayOk', this.orderId)
          this.$emit('update:visible', false)
          this.$Toast({
            message: '延期成功!',
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
.delayed-popup {
  .title {
    border-bottom: 1px solid #f8f8f8;
    padding: 20px 0 35px 0;
  }
}
</style>
