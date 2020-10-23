<template>
  <div
    @change="$emit('change', currentValue)"
    :class="{ 'my-radiogroup-large': large !== null }"
  >
    <label v-for="option in options" :key="option.value">
      <input
        class="mint-radio-input"
        type="radio"
        v-model="currentValue"
        :disabled="option.disabled"
        :value="option.value || option"
      />
      <span class="my-radiogroup-label" v-text="option.label || option"></span>
    </label>
  </div>
</template>

<script>
/**
 * my-radiogroup
 * @module components/radiogroup
 * @desc 单选框列表
 *
 * @param {string[], object[]} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string} value - 选中值
 *
 * @example
 * <my-radiogroup v-model="value" :options="['a', 'b', 'c']"></my-radiogroup>
 * large - flex布局，圆角边框，高度30px
 */
export default {
  name: 'my-radiogroup',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: String,
    large: {
      default: null
    }
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
  },
  mounted () {
  }
}
</script>

<style lang="less">
.my-radiogroup-label {
  margin-right: 10px;
  display: inline-block;
  padding: 0 5px;
  height: 22px;
  line-height: 22px;
  border-radius: 1px;
  border: 1px solid #1FC1C9;
  background-color: transparent;
  color: #1FC1C9;
  font-size: 14px;
}
.mint-radio-input:checked + .my-radiogroup-label {
  color: #ffffff;
  background-color: #1fc1c9;
}
// 大按钮
.my-radiogroup-large {
  .flex();
  label {
    .flex-num(1);
    margin-left: 15px;
    &:first-child {
      margin-left: 0;
    }
  }
  .my-radiogroup-label {
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    .flex();
    justify-content: center;
    margin:0;
  }
}
</style>
