<template>
  <div>
    <div class="p-load" v-if="!data">
      <mt-spinner class="icon" type="fading-circle" :size="20"></mt-spinner>
      <span class="text">加载中...</span>
    </div>
    <div class="p-load" v-else-if="data.length===0">
      <span class="text">{{emptyText ||' 暂无数据！' }}</span>
    </div>
    <slot v-else></slot>
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
export default {
  name: 'my-loading',
  props: {
    data: {
      default: Array
    },
    emptyText: String
  }
}
</script>

<style lang="less">
/* 新增load相关的样式 */
.p-load {
  text-align: center;
  margin: 0 auto;
  padding: 20px;
  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .text {
    color: #8d929e;
    font-size: 16px;
    vertical-align: middle;
  }
}
</style>
