<template>
  <div class="select-tips">
    <ul class="tips">
      <span
        v-for="(option, index) in options"
        :key="index"
        @click="currentValue = currentValue === option.id?  null :  option.id"
        class="mint-badge is-primary is-size-normal my-tips"
        :class="{'checked': (currentValue === option.id) }"
      >{{option['languageName']}}</span>
    </ul>
  </div>
</template>

<script>
/**
 * my-radiogroup
 * @module components/radiogroup
 * @desc 单选标签列表
 *
 * @param {string[], object[]} options - 选项数组
 * @param {string} value - 选中值
 *
 * @example
 * <select-tips v-model="value" :options="['a', 'b', 'c']"></select-tips>
 */
export default {
  name: 'my-select-tips',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: Number
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less">
.select-tips {
  .tips {
    padding: 10px 10px;
    border-top: 1px solid #f8f8f8;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    white-space: nowrap;
    .mint-badge.my-tips {
      margin: 0 5px;
      padding: 10px;
      height: 18px;
      line-height: 18px;
      border-radius: 20px;
      font-size: 14px;
      color: rgba(62, 66, 85, 1);
      background-color: rgba(255, 255, 255, 1);
      border: 0.5px solid rgba(0, 0, 0, 0.1);
    }
    .mint-badge.my-tips.checked {
      color: rgba(31, 193, 201, 1);
      border: 0.5px solid transparent;
      background-color: rgba(31, 193, 201, 0.1);
    }
  }
  //隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
