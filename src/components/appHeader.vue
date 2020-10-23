<template>
  <div>
    <mt-header
      fixed
      :title="title"
      :class="['my-header', isNativeCall ? 'worker' : 'user']"
    >
      <div slot="left">
        <div @click="goHistory" class="mr20 fl">
          <mt-button icon="back"></mt-button>
        </div>
        <div class="closediv close" @click="closePage"></div>
      </div>
      <div slot="right">
        <slot></slot>
      </div>
    </mt-header>
    <div :class="[isNativeCall ? 'mt44' : 'mt36']"></div>
  </div>
</template>
<script>
/**
 * my-loading
 * @module components/loading
 * @desc 加载简化，如果列表null，则“spinner + 加载中”， 如果列表为空，则“暂无数据”，否则使用加载组件下面的默认slot
 *
 * @example
 * <my-loading :data="result">
 *    <mt-cell v-for="item in result" :title="item"></mt-cell>
 * </my-loading>
 */
import MyUtils from '@/utils/myUtils'

export default {
  name: 'my-header',
  data () {
    return {
      isNativeCall: MyUtils.getItem('default') === 'worker'
    }
  },
  props: {
    data: {
      default: Array
    },
    title: String
  }
}
</script>

<style lang="less">
/* 新增load相关的样式 */
.my-header {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: inset 0px -0.5px 0px 0px rgba(0, 0, 0, 0.1);
  .close {
    position: relative;
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 9px;
  }
  .close::before,
  .close::after {
    position: absolute;
    content: ' ';
    background-color: black;
    left: 10px;
    bottom: 0px;
    width: 1px;
    height: 20px;
  }
  .close::before {
    transform: rotate(45deg);
  }
  .close::after {
    transform: rotate(-45deg);
  }

  &.worker {
    height: 44px;
    .mint-header {
      height: 44px;
    }
    .mint-header-title {
      font-size: 17px;
    }
    .mintui-back {
      font-size: 20px;
    }
  }
  &.user {
    .close {
      display: none;
    }
  }
}
</style>
