<template>
  <div class="mint-tabbar my-tabbar is-fixed" v-show="showTabbar" ref='tabbar'>
    <router-link
      v-for="(item, index) in list"
      :key="index"
      :class="[
        'mint-tab-item mint-cell-mask',
        { selected: current === item.name }
      ]"
      :to="item.url"
      @click.native="clickNative(item.icon)"
    >
      <div
        class="mint-tab-item-icon"
        :class="'icon-tabbar-' + item.icon"
      ></div>
      <div :class="
          item.name === '扫码' ? 'mint-tab-item-labels' : 'mint-tab-item-label'
        ">
        <span>{{ item.name }}</span>
        <template v-if="item.icon === 'workorder'">
        <mt-badge
          v-show="newWorkOrderNum"
          size="small"
          class="updated"
        >{{newWorkOrderNum > 99 ? '99+' : newWorkOrderNum}}</mt-badge>
        </template>
      </div>
    </router-link>
  </div>
</template>

<style lang="less" type="text/less">

.my-tabbar {
  height: @footer-height;
  background-color: #ffffff;
  background-image: none;
  .mint-tab-item {
    padding: 8px 0 5px;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); //去除阴影
    .updated {
      padding: 2px 5px;
      border-radius: 10px;
      background-color: red;
      position: absolute;
      top: 5px;
      left: 50%;
    }
  }
  .mint-cell-mask:active::after {
    opacity: 0;
  }
  .mint-tab-item-icon {
    display: block;
    height: 22px;
    width: 22px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .mint-tab-item-label {
    color: @nav-color;
    font-size: @font-size-mini;
  }
  .mint-tab-item-labels {
    color: @nav-color;
    font-size: @font-size-mini;
    position: relative;
    top: -31px;
  }
  .icon-tabbar-home {
    background-image: url("../assets/imgs/tabbar/home.png");
  }
  .icon-tabbar-list {
    background-image: url("../assets/imgs/tabbar/list.png");
  }
  .icon-tabbar-mine {
    background-image: url("../assets/imgs/tabbar/mine.png");
  }
  .icon-tabbar-workorder {
    background-image: url("../assets/imgs/tabbar/workorder.png");
  }
  .icon-tabbar-service {
    background-image: url("../assets/imgs/tabbar/service.png");
  }
  .icon-tabbar-scan {
    height: 52px;
    width: 52px;
    background-image: url("../assets/imgs/tabbar/scan.png");
    background-color: #ffffff;
    position: relative;
    top: -29px;
    border-radius: 25px;
  }
  .selected {
    .mint-tab-item-label {
      color: @color-green;
    }
    .mint-tab-item-labels {
      color: @color-green;
    }
    .icon-tabbar-home {
      background-image: url("../assets/imgs/tabbar/home_s.png");
    }
    .icon-tabbar-list {
      background-image: url("../assets/imgs/tabbar/list_s.png");
    }
    .icon-tabbar-mine {
      background-image: url("../assets/imgs/tabbar/mine_s.png");
    }
    .icon-tabbar-workorder {
      background-image: url("../assets/imgs/tabbar/workorder_s.png");
    }
    .icon-tabbar-service {
      background-image: url("../assets/imgs/tabbar/service_s.png");
    }
    .icon-tabbar-scan {
      background-image: url("../assets/imgs/tabbar/scan.png");
    }
  }
}
</style>

<script>
import scanCode from '../views/workorder/scanCode'
import utils from '@/utils/myUtils'
import { workOrderApi } from '@/assets/api'

export default {
  name: 'my-tabbar',
  props: {
    current: {
      default: '首页'
    }
  },
  data () {
    return {
      timer2: null,
      showTabbar: true,
      role: utils.getItem('role'),
      timer: null,
      newWorkOrderNum: Number(utils.getItem('newWorkOrderNum')),
      list: [
        { name: '首页', url: '/product/home', icon: 'home' },
        { name: '订单', url: '/order/list', icon: 'list' },
        { name: '我的', url: '/mine/home', icon: 'mine' }
      ]
    }
  },
  methods: {
    clickNative (icon) {
      // 调扫码功能
      if (icon === 'scan') {
        scanCode.scanQRCode()
      }
    },
    getWorkOrders () {
      workOrderApi.getWorkOrders(10, 1, 1).then((resp) => {
        let ret = resp.data.data
        utils.setItem('newWorkOrderNum', ret.total)
        this.newWorkOrderNum = ret.total
      })
    }
  },
  mounted () {
    // 导航栏是否显示, flag
    this.eventHub.$on('isShowTabbar', (flag) => {
      // this.showTabbar = flag
      if (flag) {
        this.showTabbar = true
        clearInterval(this.timer2)
      } else {
        // this.showTabbar = false
        this.timer2 = setInterval(() => {
          let tpl
          if (this.$refs.tabbar) {
            // 监听窗口
            tpl = window.innerHeight
            // console.log('innerHeight', tpl, tpl < 500)
            // console.log('outerHeight', window.outerHeight)
            if (tpl < 500) {
              this.showTabbar = false
            } else {
              this.showTabbar = true
            }
          }
        }, 100)
      }
    })
  },
  activated () {
    // 主管调用工单列表ids，以判断是否有新的工单出现，处理tabbar小红点提示
    if (this.role === '4') {
      this.getWorkOrders()
      this.timer = setInterval(() => {
        this.getWorkOrders(this.timer)
      }, 70000)
    }
  },
  destroyed () {
    if (this.timer) clearInterval(this.timer)
  },
  watch: {
    role: {
      immediate: true,
      handler (role) {
        if (role === '4') {
          this.list = [
            { name: '工单', url: '/workorder/manageList', icon: 'workorder' },
            { name: '服务', url: '/workorder/serviceTrack', icon: 'service' },
            { name: '订单', url: '/order/list', icon: 'list' },
            { name: '我的', url: '/mine/home', icon: 'mine' }
          ]
        } else if (role === '3' || role === '7') {
          this.list = [
            { name: '订单', url: '/order/list', icon: 'list' },
            { name: '服务', url: '/workorder/serviceTrack', icon: 'service' },
            { name: '我的', url: '/mine/home', icon: 'mine' }
          ]
        } else if (role === '5' || role === '6' || role === '8') {
          this.list = [
            { name: '服务', url: '/workorder/serviceTrack', icon: 'service' },
            { name: '扫码', url: '', icon: 'scan' },
            { name: '我的', url: '/mine/home', icon: 'mine' }
          ]
        }
      }
    }
  },
  computed: { }
}
</script>
