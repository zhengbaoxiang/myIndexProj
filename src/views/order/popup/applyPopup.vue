<template>
  <mt-popup class="mint-msgbox appraise-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div class="mint-msgbox-title title">{{isEndOrder ? '如需改价，请输入改价后金额' : '请输入改价后金额'}}</div>
    </div>
    <div class="applerate">
      <span class="myFont-DINPro-Medium font18">&yen;</span>
      <input
        class="mint-field-core price"
        :placeholder="oldPrice"
        v-model="price"
        @blur="restore"
        @input="filterPrice(price)"
      />
    </div>
    <div class="textarea-border">
      <textarea
        placeholder="请填写改价理由,必填"
        maxlength="500"
        rows="4"
        class="mint-field-core"
        v-model="note"
        @input="filterNote(note)"
        @blur="restore"
      ></textarea>
      <!-- 常用标签选择框 -->
      <my-select-tips v-model="languageIdList[0]" :options="options" @input="selectTipsOk"></my-select-tips>
      <my-voiceinput @recordOk="recordOk"></my-voiceinput>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">无需改价</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">提交申请</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi, workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  data () {
    return {
      note: '',
      price: null,
      options: [],
      languageIdList: [],
      temp: ''
    }
  },
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    },
    oldPrice: {
      default: 0
    },
    applyObj: {
      type: Object,
      default: () => null
    },
    isEndOrder: {
      default: false
    }
  },
  watch: {
    visible (val) {
      // 带已有申请改价的对象，编辑状态
      console.log('applyObj ', val, this.applyObj, this.options)
      if (!this.applyObj) {
        this.clear()
      } else if (val && this.applyObj) {
        this.price = this.applyObj.changePrice / 100
        this.note = this.applyObj.changeReason
        this.languageIdList = this.applyObj.languageIdList || []
      }
    }
  },
  computed: {
    noteTips () {
      if (utils.trim(this.note) === '' && this.languageIdList.length === 0) {
        return '请填写改价理由后提交'
      }
      return false
    },
    priceTips () {
      if (isNaN(this.price) || this.price === null || this.price < 0) {
        return '请填写修改价格'
      }
      return false
    }
  },
  created () {
    this.getCommonLanguage()
  },
  methods: {
    clear () {
      this.price = null
      this.note = ''
      this.languageIdList = []
    },
    recordOk (val) {
      // this.note = this.note + val
      this.note = utils.noteLimit(this.note + val, 500)
    },
    selectTipsOk (val) {
      if (val) {
        this.languageIdList = [val]
      } else {
        this.languageIdList = []
      }
    },
    getCommonLanguage () {
      workOrderApi.getCommonLanguage({ languageType: 1 }).then((resp) => {
        this.options = resp.data.data.map((item) => {
          item.checked = false
          return item
        })
      })
    },
    cancel () {
      this.clear()
      this.$emit('update:visible', false)
      this.$emit('applyCancel', this.applyObj)
    },
    ok () {
      if (this.noteTips) {
        this.$MessageBox.alert(this.noteTips)
        return
      }
      if (this.priceTips) {
        this.$MessageBox.alert(this.priceTips)
        return
      }
      let obj = {
        changePrice: (this.price * 100).toFixed(0),
        changeReason: this.note,
        languageIdList: this.languageIdList
      }
      if (this.orderId && !this.isEndOrder) {
        obj.orderId = this.orderId
        this.changeApply(obj)
      } else {
        this.options.map((item) => {
          if (item.id === this.languageIdList[0]) {
            obj.languageName = item.languageName
          }
        })
        this.$emit('applyOk', obj)
        this.$emit('update:visible', false) // 弹窗关闭
      }
    },
    changeApply (obj) {
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      orderApi
        .changeApply(obj)
        .then((response) => {
          this.$Toast({
            message: '申请提交成功!',
            duration: 2000
          })
          // 清空文字 防止下次评价再弹出
          this.note = ''
          this.price = null
          this.languageIdList = []
          this.$emit('applyOk')
          this.$emit('update:visible', false) // 弹窗关闭
        })
        .catch((e) => {
          this.$Toast({
            message: '申请提交失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true) // 放开按钮
        })
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    },
    filterPrice (price) {
      this.price = utils.filterPrice(price)
    }
  }
}
</script>

<style lang="less">
.appraise-popup {
  .title {
    text-align: left;
    padding-left: 15px;
  }
  .applerate {
    padding: 10px 15px 15px;
    text-align: left;
    .price {
      width: auto;
      font-size: 18px;
      margin-left: 4px;
    }
  }
  .textarea-border {
    border-top: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
    padding: 10px 0;
    textarea {
      font-size: @font-size-small;
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
