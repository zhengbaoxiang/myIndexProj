<template>
  <div class="person-list">
    <my-header title="被护理人信息"></my-header>
    <div class="mb65">
      <div v-for="item in patientList" :key="item.id" @click="cellSelected(item)">
        <mt-cell :title="item.name">
          <i v-if="item.isDefault === 1" slot="icon" class="icon-default">常用</i>
          <slot name="right">
            <span class="pr15">
              <i class="mint-cell-allow-right"></i>
            </span>
          </slot>
        </mt-cell>
      </div>
    </div>
    <!-- <div class="button-area">
      <mt-button @click="addPatient" size="large" type="primary">新增被护理人</mt-button>
    </div>-->
    <div class="footer center">
      <mt-button size="large" class="my-btn" type="primary" @click.native="addPatient">新增被护理人</mt-button>
    </div>
  </div>
</template>

<script>
import { patientApi } from '@/assets/api'

export default {
  name: 'userList',
  data () {
    return {
      patientList: []
    }
  },
  created () {
    // 获取被护理人信息
    patientApi.patientList().then(data => {
      this.patientList = data.data.data.list
    })
  },
  methods: {
    addPatient: function () {
      this.$router.push({
        path: '/user/detail'
      })
    },
    cellSelected (item) {
      if (this.$store.state.orderInfo.serviceId) {
        var _orderInfo = this.$store.state.orderInfo
        _orderInfo.patientCode = item.code
        _orderInfo.patientName = item.name
        _orderInfo.isDefaultPatient = item.isDefault
        this.$store.commit('setOrderInfo', _orderInfo)
        this.$router.go(-1)
      } else {
        // 点击跳转到详情页
        this.$router.push('/user/detail?userCode=' + item.code)
      }
    }
  }
}
</script>
<style lang="less">
.person-list {
  .mint-cell-title {
    flex: initial;
    .icon-default {
      float: right;
      margin-left: 8px;
      text-align: center;
      width: 44px;
      height: 18px;
      line-height: 18px;
      border-radius: 1px;
      background-color: rgba(31, 193, 201, 0.1);
      color: @color-green;
      font-size: @font-size-mini;
    }
    .mint-cell-text {
      float: right;
    }
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
  }
}
</style>
