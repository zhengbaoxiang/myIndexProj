<template>
  <div
    @dragstart.prevent
    :class="[
      'my-input-number',
      { 'is-disabled': disabled }
    ]"
  >
    <span
      class="decrease"
      v-if="controls"
      @click="decrease"
      :class="{'is-disabled': minDisabled}"
      @keydown.enter="decrease"
    >-</span>
    <span
      class="increase"
      v-if="controls"
      @click="increase"
      :class="{'is-disabled': maxDisabled}"
      @keydown.enter="increase"
    >+</span>
    <input
      ref="input"
      type="number"
      v-model="currentValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="mint-field-core"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @input="handleInput"
      @change="handleInputChange"
      @blur="restore"
    >
  </div>
</template>
<script>
import utils from '@/utils/myUtils'

export default {
  name: 'my-inputnumber',
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    disabled: Boolean,
    controls: {
      type: Boolean,
      default: true
    },
    value: {},
    name: String,
    label: String,
    placeholder: String
  },
  data () {
    return {
      currentValue: 1
    }
  },
  mounted () {
    this.currentValue = this.value
  },
  computed: {
    minDisabled () {
      return this.currentValue <= this.min
    },
    maxDisabled () {
      return this.currentValue >= this.max
    }
  },
  methods: {
    increase () {
      if (this.disabled || this.maxDisabled) return
      this.setCurrentValue(++this.currentValue)
    },
    decrease () {
      if (this.disabled || this.minDisabled) return
      this.setCurrentValue(--this.currentValue)
    },
    setCurrentValue (newVal) {
      if (newVal >= this.max) newVal = this.max
      if (newVal <= this.min) newVal = this.min
      this.currentValue = newVal
      this.$emit('input', newVal)
    },
    handleInput (value) {
      utils.filterEmojiStrict(value.srcElement.value)
    },
    handleInputChange (value) {
      this.setCurrentValue(utils.filterEmojiStrict(value.srcElement.value))
    }
  }
}
</script>

<style lang="less">
.my-input-number {
  position: relative;
  display: inline-block;
  width: 90px;
  line-height: 22px;
  .is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    opacity: 0.3;
  }
  border-radius: 1px;
  overflow: hidden;
  input {
    box-sizing: border-box;
    color: @color-default;
    display: inline-block;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    outline: none;
    padding: 0 20px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    -webkit-appearance: none;
    text-align: center;
    background-color: rgba(197, 208, 224, 0.15);
    vertical-align: top;
  }
  .increase,
  .decrease {
    width: 22px;
    height: 22px;
    background-color: @color-green;
    position: absolute;
    z-index: 1;
    top: 0;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
  }
  .decrease {
    left: 0;
  }
  .increase {
    right: 0;
  }
}
</style>
