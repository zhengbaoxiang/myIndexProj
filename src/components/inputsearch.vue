<template>
  <div class="my-search rel" :class="{ large: large !== null }">
    <div class="my-searchbar-inner">
      <i class="icon-search"></i>
      <input
        ref="input"
        type="text"
        @click="visible = true"
        v-model="currentValue"
        :placeholder="placeholder"
        class="mint-searchbar-core"
        @focus="hideTabbar"
        @blur="showTabbar"
      />
    </div>
    <i
      class="myicon icon-close1 text-grey"
      @click=";(visible = false), (currentValue = '')"
      v-show="visible && currentValue"
    ></i>
  </div>
</template>

<script>
/**
 * my-search
 * @module components/search
 * @desc 搜索框
 * @param {string} value - 绑定值
 * @param {string} [placeholder=取消] - 搜索框占位内容
 * @param {boolean} [autofocus=false] - 自动 focus
 * @param {boolean} [show=false] - 始终显示列表
 * @param {string[]} [result] - 结果列表
 * @param {slot} 结果列表
 * @param large 高度36px，适用于APP； 不传则为null高度30，适合微信端页头
 *
 * @example
 * <my-search large :value.sync="value" :result.sync="result"></my-search>
 * <my-search :value.sync="value">
 *   <mt-cell v-for="item in result" :title="item"></mt-cell>
 * </my-search>
 */
export default {
  name: 'my-inputsearch',

  data () {
    return {
      visible: false,
      currentValue: this.value
    }
  },
  methods: {
    hideTabbar () {
      console.log('获得焦点，隐藏底部导航tabbar')
      // this.$emit('focusFlag', false)
      this.eventHub.$emit('isShowTabbar', false)
    },
    showTabbar () {
      console.log('失去焦点，显示底部导航tabbar')
      // this.$emit('focusFlag', true)
      this.eventHub.$emit('isShowTabbar', true)
    }
  },

  watch: {
    currentValue (val) {
      this.$emit('input', val)
    },

    value (val) {
      this.currentValue = val
    }
  },

  props: {
    value: String,
    autofocus: Boolean,
    show: Boolean,
    placeholder: {
      default: '搜索'
    },
    result: Array,
    path: {
      default: ''
    },
    large: null
  },

  mounted () {
    this.autofocus && this.$refs.input.focus()
    if (this.path === 'orderList') {
      this.$refs.input.value = this.value
      this.currentValue = this.value
    }
  }
}
</script>

<style lang="less">
.my-search {
  background-color: #ffffff;
  .flex-num(1);
  .icon-search:before {
    content: '';
    background: url('../assets/imgs/icon_search.png') center center no-repeat;
    background-size: 100% auto;
    display: block;
    height: 16px;
    width: 15px;
  }
  .icon-close1 {
    position: absolute;
    right: 5px;
    top: 50%;
    margin-top: -10px;
    opacity: 0.5;
  }
  .my-searchbar-inner {
    background-color: rgba(197, 208, 224, 0.15);
    border-radius: 2px;
    .flex();
    .flex-num(1);
    height: 20px;
    padding: 7px 10px 3px;
    input {
      padding-left: 5px;
      background-color: transparent;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
    }
  }

  @search-height: 26px;
  &.large {
    .icon-search:before {
      height: @search-height;
    }
    .my-searchbar-inner {
      height: @search-height;
      input {
        height: @search-height;
        line-height: @search-height;
      }
    }
  }
}
</style>
