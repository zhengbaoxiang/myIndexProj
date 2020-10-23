<template>
  <mt-popup
    class="mint-msgbox appraise-popup"
    v-if="visible"
    v-model="visible"
    :closeOnClickModal="false"
  >
    <div class="mint-msgbox-header mb15">
      <div class="mint-msgbox-title">备注信息</div>
    </div>
    <div class="textarea-border">
      <textarea
        :placeholder="placeholderInfo"
        class="mint-field-core"
        @input="filterNote(note)"
        rows="4"
        :maxlength="maxlength"
        v-model="note"
        @blur="restore"
        ref="input"
      ></textarea>
      <my-voiceinput @recordOk="recordOk"></my-voiceinput>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">确定</button>
    </div>
  </mt-popup>
</template>
<script>
import { workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  data () {
    return {
      note: ''
    }
  },
  props: {
    propnote: {
      default: ''
    },
    visible: {
      default: true
    },
    workOrderId: {
      default: 0
    },
    orderServiceLogId: {
      default: 0
    },
    completeStatus: {
      default: -1
    },
    placeholderInfo: {
      default: '特殊情况说明'
    },
    used: {
      default: ''
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
          this.$nextTick(() => {
            this.$refs.input.focus()
            this.$refs.input.value = this.propnote
            this.note = this.propnote
          })
        }
      }
    }
  },
  computed: {
    noteTips () {
      if (
        (this.completeStatus === 1 || this.used === 'workServiceNote') &&
        utils.trim(this.note) === ''
      ) {
        return '请填写备注后提交'
      } else return false
    }
  },
  methods: {
    recordOk (val) {
      // this.note = this.note + val
      this.note = utils.noteLimit(this.note + val, Number(this.maxlength))
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
      switch (this.used) {
        case 'workServiceNote':
          this.workServiceNote()
          break
        case 'sendWorkerLog':
          this.sendWorkerLog()
          break
      }
      console.log('444')
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    },
    sendWorkerLog () {
      workOrderApi
        .sendWorkerLog(this.orderServiceLogId, this.completeStatus, this.note)
        .then(response => {
          this.$Toast({
            message: '服务确认成功！',
            duration: 2000
          })
          this.$emit('workerLogOk')
          this.$emit('update:visible', false)
        })
        .catch(e => {
          this.$Toast({
            message: '服务确认失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    workServiceNote () {
      workOrderApi
        .workServiceNote(this.workOrderId, this.note)
        .then(response => {
          this.$Toast({
            message: '提交备注成功！',
            duration: 2000
          })
          console.log(response.data.data)
          let data = {
            id: this.workOrderId,
            userCode: response.data.data.userCode,
            userName: response.data.data.name,
            note: this.note
          }
          this.$emit('remarkOk', data)
          this.$emit('update:visible', false)
        })
        .catch(e => {
          this.$Toast({
            message: '提交备注失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    }
  }
}
</script>

<style lang="less">
.appraise-popup {
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
    padding-bottom: 10px;
    textarea {
      font-size: @font-size-small;
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
