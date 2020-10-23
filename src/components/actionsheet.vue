<template>
  <!-- 结合actionSheet和popUp效果 增加顶部取消和确认按钮，以及居中的标题栏 支持多列picker 可参考被护理人信息详情页 -->
  <mt-popup v-show="currentValue" class="my-actionsheet" position="bottom">
    <mt-picker
      :slots="data"
      @change="onValuesChange"
      showToolbar
      :itemHeight="50"
      @touchmove.native.prevent
      :valueKey="valueKey"
    >
      <a class="my-actionsheet-button left" @click="currentValue=false">取消</a>
      <a class="my-actionsheet-title">{{ title }}</a>
      <a class="my-actionsheet-button right" @click="ok">确定</a>
    </mt-picker>
  </mt-popup>
</template>

<style lang="less">
.my-actionsheet {
  .my-actionsheet-button {
    position: absolute;
    text-align: center;
    top: 0;
    display: block;
    height: 52px;
    line-height: 52px;
    font-size: 14px;
    // background-color: #fff;
    &:active {
      background-color: #f0f0f0;
    }
    &.left {
      left: 15px;
      color: @color-default;
    }
    &.right {
      right: 15px;
      color: @color-green;
    }
  }

  .my-actionsheet-title {
    display: block;
    text-align: center;
    width: 100% - 120px;
    height: 52px;
    line-height: 52px;
    font-size: 16px;
    color: @color-default;
    background-color: #fff;
    box-shadow: inset 0px -0.5px 0px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>

<script>
import Popup from 'mint-ui/src/utils/popup'
export default {
  name: 'my-actionsheet',
  mixins: [Popup],
  props: {
    modal: {
      default: true
    },
    modalFade: {
      default: false
    },
    lockScroll: {
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '请选择'
    },
    valueKey: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      currentValue: false,
      selectedData: null // 返回选中的value
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

  methods: {
    // picker发生改变
    onValuesChange (picker, val) {
      if (this.valueKey && val[0]) {
        picker.setSlotValues(1, val[0].items)
      }
      this.selectedData = val
    },
    // 点击确定，emit事件。
    ok () {
      // 如果没有触发onValuesChange，则默认将data列表中的各个第一条数据返回
      if (this.selectedData.length === 0) {
        this.selectedData = this.data.map(m => {
          return m.values[m.defaultIndex || 0]
        })
      }
      this.$emit('change', this.selectedData)
      this.currentValue = false
    }
  },

  mounted () {
    if (this.value) {
      this.rendered = true
      this.currentValue = true
      this.open()
    }
  }
}
</script>
