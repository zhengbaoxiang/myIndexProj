<template>
  <mt-popup class="mint-msgbox appraise-popup" v-model="visible" :closeOnClickModal="false">
    <div class="mint-msgbox-header">
      <div class="mint-msgbox-title">服务满意度</div>
    </div>
    <ul class="rate">
      <li v-for="(star, i) in stars" :key="i">
        <i :class="['myicon star', {'fill' : star}]" @click="setStar(i)"></i>
      </li>
    </ul>
    <span class="star_tip mb10 center font12">{{rateTipText}}</span>
    <div class="tip">
      <div
        v-for="(item, index) in this.appraiseTip"
        :key="index"
        class="single-carer"
        :class="{selectBackground:item.checked }"
        @click="selected(item)"
      >{{item.label}}</div>
    </div>
    <div class="textarea-border">
      <textarea
        placeholder="服务满足您的期待吗，您的意见帮助我们进步。"
        maxlength="500"
        rows="4"
        class="mint-field-core"
        v-model="note"
        @input="filterNote(note)"
        @blur="restore"
      ></textarea>
    </div>
    <div class="mint-msgbox-btns">
      <button class="mint-msgbox-btn mint-msgbox-cancel" @click="cancel">取消</button>
      <button class="mint-msgbox-btn mint-msgbox-confirm" @click="ok">确定</button>
    </div>
  </mt-popup>
</template>
<script>
import { orderApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  data () {
    return {
      note: '',
      stars: [true, true, true, true, true],
      rateTipText: '非常满意,五星好评',
      rateTip: [
        '非常不满意，各方面都很差',
        '不满意，比较失望',
        '一般，还需改善',
        '比较满意，仍可改善',
        '非常满意,五星好评'
      ],
      appraiseTip: [],
      appraiseGood: [],
      appraiseBad: [],
      appraiseTipList: []
    }
  },
  props: {
    visible: {
      default: true
    },
    orderId: {
      default: 0
    }
  },
  created () {
    // this.appraiseTip = this.appraiseGood;
    this.labelsInit()
  },
  watch: {
    stars: {
      handler (stars) {
        if (stars) {
          this.appraiseTipList = []
          this.appraiseTip.forEach(item => {
            this.$set(item, 'checked', false)
          })
          console.log(this.appraiseTip)
        }
      }
    }
  },
  computed: {
    noteTips () {
      return utils.trim(this.note) === ''
    }
  },
  methods: {
    labelsInit () {
      orderApi
        .evaluateTip()
        .then(response => {
          this.appraiseOne = response.data.data.one
          this.appraiseTwo = response.data.data.two
          this.appraiseThree = response.data.data.three
          this.appraiseFour = response.data.data.four
          this.appraiseFive = response.data.data.five
          this.appraiseTip = this.appraiseFive
        })
        .catch()
    },
    setStar (i) {
      this.stars = this.stars.map((star, index) => {
        return i >= index
      })
      this.rateTipText = this.rateTip[i]
      switch (i) {
        case 0:
          this.appraiseTip = this.appraiseOne
          break
        case 1:
          this.appraiseTip = this.appraiseTwo
          break
        case 2:
          this.appraiseTip = this.appraiseThree
          break
        case 3:
          this.appraiseTip = this.appraiseFour
          break
        case 4:
          this.appraiseTip = this.appraiseFive
          break
      }
      // if (i === 4) {
      //   this.appraiseTip = this.appraiseGood;
      // } else {
      //   this.appraiseTip = this.appraiseBad;
      // }
    },
    cancel () {
      this.$emit('update:visible', false)
    },
    ok () {
      if (!this.note) {
        this.$MessageBox.alert('请填写评价内容')
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      orderApi
        .evaluate(
          this.orderId,
          this.stars.lastIndexOf(true) + 1,
          this.note,
          this.appraiseTipList
        )
        .then(response => {
          this.$Toast({
            message: '评价成功！',
            duration: 2000
          })
          // 清空评价 防止下次评价再弹出
          this.note = ''
          this.$emit('appraiseOk')
          this.$emit('update:visible', false)
        })
        .catch(e => {
          this.$Toast({
            message: '评价失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    },
    selected (item) {
      if (typeof item.checked === 'undefined') {
        this.$set(item, 'checked', true)
      } else {
        item.checked = !item.checked
      }
      if (item.checked) {
        this.appraiseTipList.push(item.id)
      } else {
        for (var i = 0; i < this.appraiseTipList.length; i++) {
          if (this.appraiseTipList[i] === item.id) {
            this.appraiseTipList.splice(i, 1)
          }
        }
      }
      console.log(this.appraiseTipList)
    }
  }
}
</script>

<style lang="less">
.appraise-popup {
  .rate {
    padding: 5px 0 5px;
    text-align: center;
    li {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .star_tip {
    display: block;
    color: #f8b71c;
  }
  .tip {
    padding: @m5;
    min-height: 85px;
    margin-bottom: 4px;
    .single-carer {
      font-size: 14px;
      color: #3e4255;
      width: 28.36%;
      text-align: center;
      height: 30px;
      line-height: 30px;
      margin: @m5 0 @m5 @m10;
      float: left;
      border-radius: 2px;
      background-color: @color-white;
      border: 0.5px solid rgba(0, 0, 0, 0.1);
    }
    .selectBackground {
      color: @color-green;
      border-radius: 2px;
      background-color: rgba(31, 193, 201, 0.1);
      border: 0.5px solid rgba(0, 0, 0, 0);
    }
  }

  .textarea-border {
    clear: both;
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
