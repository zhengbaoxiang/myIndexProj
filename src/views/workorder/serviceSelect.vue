<template>
  <div class="service-select">
    <my-header title="服务项"></my-header>
    <div>
      <mt-navbar v-model="selected" v-if="serviceIds.length > 1">
        <mt-tab-item :id="index" v-for="(item, index) in serviceIds" :key="index">{{index + 1}}</mt-tab-item>
      </mt-navbar>
      <div class="title">
        <div class="font18">{{productBigTitle}}</div>
      </div>
      <ul class="list-area" v-if="id">
        <li v-for="(item, index) in comenOrderServiceLogs" :key="index">
          <mt-cell
            :title="item.serviceItemName"
            icon="mydot mint-badge is-primary is-size-small"
            :to="{name:'serviceConfirm',query: { orderServiceItemId: item.orderServiceItemId }}"
            is-link
          ></mt-cell>
        </li>
        <li>
          <mt-cell
            :title="addOrderServiceLogs.serviceItemName"
            icon="mydot mint-badge is-primary is-size-small"
            :to="{name:'serviceConfirm',query: { orderServiceItemId: addOrderServiceLogs.orderServiceItemId }}"
            is-link
          ></mt-cell>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'
import store from '../../store'
export default {
  name: 'serviceSelect',
  data () {
    return {
      role: utils.getItem('role'),
      comenOrderServiceLogs: [],
      addOrderServiceLogs: {},
      productBigTitle: '',
      id: null,
      serviceId: null,
      serviceIds: [],
      selected: 0,
      needRefresh: true
    }
  },
  created () {
    // document.body.style.height = '100%'
    // document.body.style.backgroundColor = 'rgba(70, 196, 207, 1)'
  },
  mounted () {
    // 初始化数据
  },
  activated () {
    if (this.$store.state.refreshNext.serviceSelect) {
      window.scroll(0, 0)
      this.id = null
      this.productBigTitle = ''
      // 获取跳转信息
      this.serviceIds = this.$route.query.serviceIds || null
      // 防止传递单个工单时,id字符串被截取导致页面展示异常
      if (!Array.isArray(this.serviceIds)) {
        this.serviceIds = new Array(this.serviceIds)
      }
      this.selected = 0
      this.serviceId = this.serviceIds[0]
      this.serviceListshow(this.serviceId)
    }
    document
      .querySelector('body')
      .setAttribute(
        'style',
        'background-color:rgba(70, 196, 207, 1);height:100%'
      )
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'serviceConfirm') {
      store.state.refreshNext.serviceSelect = false
    } else {
      store.state.refreshNext.serviceSelect = true
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    document.querySelector('body').removeAttribute('style')
    next()
  },
  watch: {
    selected (newval, oldval) {
      this.serviceId = this.serviceIds[parseInt(this.selected)]
      this.serviceListshow(this.serviceId)
    }
  },
  methods: {
    serviceListshow (id) {
      this.$Indicator.open('正在加载...')
      workOrderApi
        .getWorkService(id)
        .then(resp => {
          if (resp.data.data) {
            const result = resp.data.data
            this.productBigTitle = result.productBigTitle
            this.id = result.id
            this.comenOrderServiceLogs = result.comenOrderServiceLogs
            this.addOrderServiceLogs = result.addOrderServiceLogs[0]
          }
        })
        .finally(() => {
          this.$Indicator.close()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.service-select {
  .mint-navbar {
    padding: 12px 15px 2px 15px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    .mint-tab-item {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 11px 0;
      font-size: 14px;
      background-color: rgba(245, 245, 250, 1);
      width: 36px;
      flex: none;
    }
    .mint-tab-item.is-selected {
      background-color: rgba(31, 193, 201, 0.1);
    }
  }
  .title {
    padding: 15px 20px 0;
    font-weight: bold;
    color: #ffffff;
  }
  ul.list-area {
    padding: 0 15px 15px 15px;
    background-color: rgba(70, 196, 207, 1);
    li {
      padding-top: 15px;
      border-radius: 5px;
    }
    /deep/ .mint-cell {
      border-radius: 5px;
      box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
      border: 0.5px solid rgba(236, 236, 243, 1);
    }
    /deep/ .mint-cell-wrapper {
      padding: 20px 36px 20px 15px;
      font-size: 20px;
      font-weight: bold;
      span {
        position: relative;
        left: 16px;
      }
    }
  }
}
</style>

<style lang="less" >
.mintui-mydot.mint-badge.is-size-small {
  padding: 3px 3px;
  border-radius: @m5;
  background-color: rgba(31, 193, 201, 1);
  position: absolute;
  top: 50%;
  margin-top: -3px;
}
</style>
