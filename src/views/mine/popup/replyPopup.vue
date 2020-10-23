<template>
  <mt-popup
    class="mint-msgbox reply-popup"
    v-if="visible"
    v-model="visible"
    :closeOnClickModal="false"
  >
    <div class="mint-msgbox-header mb15">
      <div class="mint-msgbox-title">回复建议与反馈</div>
    </div>
    <div class="textarea-border">
      <textarea
        placeholder="回复信息"
        class="mint-field-core"
        @input="filterNote(note)"
        rows="4"
        :maxlength="maxlength"
        v-model="note"
        @blur="restore"
        ref="input"
      ></textarea>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">回复</button>
    </div>
  </mt-popup>
</template>
<script>
import { mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  data () {
    return {
      note: ''
    }
  },
  props: {
    visible: {
      default: true
    },
    id: {
      default: 0
    },
    maxlength: {
      default: '200'
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (visible) {
        if (visible) {
          console.log('iddddddddddddd', this.id)
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        }
      }
    }
  },
  computed: {
    noteTips () {
      if (this.completeStatus === 1 && utils.trim(this.note) === '') {
        return '请填写回复信息后提交'
      } else return false
    }
  },
  methods: {
    restore () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        setTimeout(function () {
          // 解决 : IOS 回复框实现为fixed,下拉至底部显示回复框
          document.body.scrollTop = document.body.scrollTop - 1
        }, 100)
        // window.scroll(0, 0)
      }
    },
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (this.noteTips) {
        this.$MessageBox.alert(this.noteTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      mineApi
        .reply(this.id, this.note)
        .then(resp => {
          let ret = resp.data.data
          this.$emit('remarkOk', ret)
          this.$emit('update:visible', false)
        })
        .catch(e => {
          this.$Toast(e.data.errmsg)
        })
        .finally(() => {
          this.$Indicator.close()
          this.$store.commit('setSubmit', true)
        })
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    }
  }
}
</script>

<style lang="less">
.reply-popup {
  .rate {
    padding: 5px 0 15px;
    text-align: center;
    li {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .textarea-border {
    border-top: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
    textarea {
      font-size: @font-size-small;
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
