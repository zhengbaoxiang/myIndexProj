<template>
  <div class="bind">
    <my-header title="绑铃">
      <div @click="$router.replace({name:'manageList'})" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </my-header>
    <div v-if="status > 0" class="center">
      <div class="info">
        <img :src="errImg" />
        <div
          v-if="errText"
          :class="['pt10',status === 6 ? 'text-default' : 'text-grey']"
        >{{errText}}</div>
      </div>
      <div class="num">
        <div v-if="$store.state.bindInfo.orderCode">订单编号: {{$store.state.bindInfo.orderCode}}</div>
        <div
          class="mt10"
          v-if="$store.state.bindInfo.hardwareQrCode"
        >按铃编号: {{$store.state.bindInfo.hardwareQrCode}}</div>
      </div>
      <div class="footer center">
        <mt-button
          v-if="status === 6"
          size="large"
          class="my-btn btn-refund"
          type="primary"
          @click="$router.replace({name:'manageList'})"
        >返回</mt-button>
        <mt-button size="large" class="my-btn" type="primary" @click="bind">{{buttonText}}</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import scanCode from './scanCode'
export default {
  name: 'bind',
  data () {
    return {
      status: 0
    }
  },
  created () {
    this.initStatus(this.$store.state.bindInfo)
  },
  destroyed () {
    this.$store.commit('setBindInit')
  },
  watch: {
    '$store.state.bindInfo': {
      handler (val) {
        console.log('initle', val)
        this.initStatus(this.$store.state.bindInfo)
      },
      deep: true
    }
  },
  computed: {
    errImg () {
      switch (this.status) {
        case 2:
          return require('../../assets/imgs/order@2x.png')
        case 4:
          return require('../../assets/imgs/bell@2x.png')
        case 6:
          return require('../../assets/imgs/order_bell@2x.png')
        default:
          return require('../../assets/imgs/unbind@2x.png')
      }
    },
    errText () {
      switch (this.status) {
        case 1:
          return '无效码，请扫订单编码或者按铃编码哦'
        case 3:
          return '无效码，请扫按铃编码哦'
        case 5:
          return '无效码，请扫订单编码哦'
        case 6:
          return '订单按铃已成功绑定！'
        default:
          return ''
      }
    },
    buttonText () {
      switch (this.status) {
        case 1:
          return '继续扫码'
        case 2:
          return '扫按铃码完成绑定'
        case 3:
          return '扫按铃码完成绑定'
        case 4:
          return '扫订单码完成绑定'
        case 5:
          return '扫订单码完成绑定'
        case 6:
          return '继续绑铃'
        default:
          return ''
      }
    }
  },
  methods: {
    initStatus (info) {
      console.log('info', info)
      if (!info.orderCode && !info.hardwareQrCode && info.status === 1) {
        this.status = 1 // 扫描的第一个码异常 提示扫描 A / B
      } else if (info.orderCode && !info.hardwareQrCode && info.status === 0) {
        this.status = 2 // 扫完订单 且正常 提示 扫描铃
      } else if (info.orderCode && !info.hardwareQrCode && info.status === 1) {
        this.status = 3 // 扫完订单 且异常 提示 无效请扫描铃
      } else if (!info.orderCode && info.hardwareQrCode && info.status === 0) {
        this.status = 4 // 扫完铃   且正常 提示 扫描订单
      } else if (!info.orderCode && info.hardwareQrCode && info.status === 1) {
        this.status = 5 // 扫完铃   且异常 提示 无效请扫描订单
      } else if (info.orderCode && info.hardwareQrCode) {
        this.status = 6 // 扫描完二者且正常 这时绑定成功
      }
    },
    bind () {
      if (this.status === 6) {
        this.$store.commit('setBindInit')
      }
      scanCode.getBind()
    }
  }
}
</script>
<style lang="less" scoped>
.bind {
  .info {
    margin-top: 134px;
    margin-bottom: 30px;
    img {
      width: 50%;
      max-width: 378px;
    }
  }
  .num {
    width: 77%;
    margin: 0 auto;
    text-align: left;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
    }
    .btn-refund {
      color: rgba(141, 146, 158, 1);
      background-color: @background-white;
    }
    .btn-untime {
      background-color: rgba(141, 146, 158, 1);
    }
    .has-border-left:before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -11px;
      width: 0;
      height: 22px;
      border-left: 0.5px solid rgba(209, 253, 255, 1);
    }
  }
}
</style>
