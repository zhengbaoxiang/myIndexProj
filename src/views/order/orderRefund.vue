<template>
  <div class="order-refund pb65">
    <my-header title="退款申请"></my-header>
    <div class="center p10">
      <h2>退款申请</h2>
      <p class="center mb10 text-grey font14">需提前结束服务/减少服务次数</p>
    </div>
    <ul class="mainInfo mb10 title" v-if="role === '2'">
      <li class="pb15">
        <span>退除信息</span>
        <mt-button
          v-if="kind !== 2"
          class="button"
          size="small"
          type="primary"
          plain
          @click="sheetVisible = !sheetVisible"
        >部分退除</mt-button>
      </li>
      <li class="mt10 mb15" v-if="kind !== 2">
        <span>退款天数</span>
        <span class="text-red button myFont-DINPro-Medium">{{refundDates.length + '天'}}</span>
      </li>
      <li>
        <span v-if="serviceStatus === 4" class="text-grey">退款金额</span>
        <!-- <span
          v-if="serviceStatus !== 4"
          class="text-red button myFont-DINPro-Medium"
        >{{((Math.min(realPrice,Math.ceil(realPrice / serviceDates.length * refundDates.length)) || 0 )/100 )+ '元'}}</span>-->
        <span v-if="serviceStatus === 4" class="text-red button myFont-DINPro-Medium">{{'0元'}}</span>
        <mt-cell v-if="serviceStatus !== 4" title="退款金额">
          <slot name="right">
            <input
              v-model="refundSumPrice"
              class="mint-field-core right mr5 text-red"
              placeholder="请填写退款金额"
              maxlength="8"
              @focus="linkfocus"
              @blur="restore"
            />
            <span class="text-red myFont-DINPro-Medium">元</span>
          </slot>
        </mt-cell>
      </li>

      <!-- <mt-cell title="退款天数">
        {{refundDates.length * (unitPrice || 0)/100 + '元'}}
        <slot name="right">
          <input
            class="mint-field-core right text-red"
            :value="4 + '天'"
            readonly
            unselectable="on"
            onfocus="this.blur()"
          />
        </slot>
      </mt-cell>
      <mt-cell v-if="serviceStatus === 4 " title="退款金额" value="0 元"></mt-cell>
      <mt-cell v-else title="退款金额">
        <slot name="right">
          <input
            class="mint-field-core right text-red"
            :value="spareDays * (unitPrice || 0)/100 + '元'"
            readonly
            unselectable="on"
            onfocus="this.blur()"
          />
        </slot>
      </mt-cell>-->
      <!-- :label="'已服务'+realNum+'天'"
      :label="'已服务'+actualDays+'天'"-->
    </ul>
    <ul class="mb10" v-if="entryLinkLogic.isWorker()">
      <li>
        <mt-cell title="退款天数">
          <slot name="right">
            <span @click="sheetVisible = !sheetVisible" class="pr15">
              <input
                class="mint-field-core right"
                readonly
                :value="refundDates.length > 0? refundDates.length + '天' :''"
                placeholder="请选择日期"
                unselectable="on"
                onfocus="this.blur()"
                @blur="restore"
              />
              <i class="mint-cell-allow-right"></i>
            </span>
          </slot>
        </mt-cell>
      </li>
      <li>
        <mt-cell title="退款金额">
          <slot name="right">
            <input
              v-model="refundSumPrice"
              class="mint-field-core right mr5"
              placeholder="请填写退款金额"
              maxlength="8"
              @focus="linkfocus"
              @blur="restore"
            />
            <span>元</span>
          </slot>
        </mt-cell>
      </li>
    </ul>
    <div class="mainInfo">
      <mt-cell :title="'备注('+note.length+'/500)'" style="box-shadow:none"></mt-cell>
      <div class="note">
        <textarea
          placeholder="如有特殊情况，请说明"
          class="mint-field-core"
          maxlength="500"
          v-model="note"
          @input="filterNote(note)"
          @blur="restore"
        ></textarea>
        <my-select-tips :options="options" @input="selectTipsOk"></my-select-tips>
        <my-voiceinput class="mb10" @recordOk="recordOk"></my-voiceinput>
      </div>
    </div>
    <!-- <p class="ptb10 plr15 text-grey font12">温馨提示：退款计算方式见
      <router-link :to="{path:'/mine/issue'}" class="text-green">《常见问题》</router-link>
    </p>-->
    <p></p>
    <div class="bottom fixed">
      <mt-button type="primary" size="large" @click="applyRefund()">提交申请</mt-button>
    </div>
    <selected-date
      title="请选择退款天数"
      pattern="refund"
      v-model="sheetVisible"
      @refundDate="refundDateInit"
      :data="serviceDates"
    ></selected-date>
  </div>
</template>

<script>
import { orderApi, workOrderApi } from '@/assets/api'
import selectedDate from './popup/selectedDate'
import utils from '@/utils/myUtils'
import { entryLinkLogic } from './orderLogic'

export default {
  name: 'orderRefund',
  data () {
    return {
      orderId: -1,
      role: utils.getItem('role'),
      entryLinkLogic,
      campusId: -1,
      realStartTime: -1,
      realNum: 0,
      unitPrice: 0,
      note: '',
      spareDays: -1,
      actualDays: 0,
      serviceStatus: -1,
      serviceDates: [],
      refundDates: [],
      refundSumPrice: '',
      realPrice: '',
      sheetVisible: false,
      options: [],
      kind: -1,
      selectOptions: []
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    this.getData(this.orderId)
  },
  components: { selectedDate },
  methods: {
    recordOk (val) {
      this.note = utils.noteLimit(this.note + val, 500)
    },
    selectTipsOk (val) {
      if (val) {
        this.selectOptions = [val]
      }
    },
    refundDateInit (val) {
      this.refundDates = val
      this.refundSumPrice =
        (Math.min(
          this.realPrice,
          Math.ceil(
            (this.realPrice / this.serviceDates.length) *
              this.refundDates.length
          )
        ) || 0) / 100
    },
    // 主管获取常用语
    getCommonLanguage () {
      // 先注释掉待联调
      workOrderApi
        .getCommonLanguage({
          languageType: 2,
          campusId: this.campusId
        })
        .then((resp) => {
          this.options = resp.data.data
        })
    },

    restore () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        window.scroll(0, 0)
      }
    },
    async getData (orderId) {
      try {
        const data = await orderApi.getOrderDetail(orderId)
        if (!data.data.data) {
          return this.$MessageBox
            .alert('订单数据异常，请稍后重试！')
            .then(() => {
              this.$router.go(-1)
            })
        }
        let orderInfo = data.data.data
        if (orderInfo.payStatus !== 2) {
          return this.$MessageBox.alert('该订单不可申请退款！').then(() => {
            this.$router.go(-1)
          })
        } else {
          this.realStartTime = orderInfo.realStartTime
          this.realNum = orderInfo.realNum
          this.unitPrice = orderInfo.unitPrice
          this.serviceStatus = orderInfo.serviceStatus
          this.serviceDates = orderInfo.serviceDates
          this.realPrice = orderInfo.realPrice
          this.campusId = orderInfo.campusId
          this.kind = orderInfo.kind
          this.getCommonLanguage()
          // 初始化可退款天数
          let date = new Date()
          date.setHours(0)
          date.setMinutes(0)
          date.setSeconds(0)
          date.setMilliseconds(0)
          let startTime = date.getTime()
          console.log(
            startTime,
            this.serviceDates[this.serviceDates.length - 1]
          )
          if (this.role === '2') {
            if (startTime < this.serviceDates[this.serviceDates.length - 1]) {
              this.refundDates = this.serviceDates.filter(function (number) {
                return number >= startTime
              })
            } else {
              this.refundDates = orderInfo.serviceDates
            }
            this.refundSumPrice =
              (Math.min(
                this.realPrice,
                Math.ceil(
                  (this.realPrice / this.serviceDates.length) *
                    this.refundDates.length
                )
              ) || 0) / 100
          }
          this.actualDays = Math.floor(
            (new Date().getTime() - this.realStartTime) / 86400000
          )
          // 服务尚未开始
          if (this.actualDays < 0) {
            this.actualDays = 0
          }
          // 如果服务为进行中且到了下午两点
          // if (this.serviceStatus === 2 && new Date().getHours() >= 14) {
          //   this.actualDays = this.actualDays + 1
          // }
          this.spareDays = this.realNum - this.actualDays
          if (this.spareDays < 0) {
            this.spareDays = 0
          }
          // 可申请退款的天数
          // if (
          //   this.spareDays <= 0 &&
          //   (this.serviceStatus === 1 || this.serviceStatus === 2)
          // ) {
          //   this.$MessageBox
          //     .alert('可申请退款天数不足1天，不能申请退款！')
          //     .then(() => {
          //       this.$router.go(-1)
          //     })
          // }
        }
      } catch (err) {
        this.$MessageBox.alert('订单数据异常，请稍后重试！！').then(() => {
          this.$router.go(-1)
        })
      }
    },
    applyRefund () {
      // 调退款申请
      const careOrderRefund = {
        orderId: this.$route.query.orderId,
        note: this.note,
        refundDates: this.refundDates,
        languageIdList: this.selectOptions
      }
      if (this.entryLinkLogic.isWorker()) {
        // if (!this.refundDates || this.refundDates.length === 0) {
        //   this.$MessageBox.alert('请选择退款日期')
        //   return
        // }
        if (!this.note && this.selectOptions.length === 0) {
          this.$MessageBox.alert('请填写备注')
          return
        }
      }

      // if (!this.refundSumPrice) {
      //   this.$MessageBox.alert('请填写退款金额')
      //   return
      // }
      var regex = /^\d{0,8}\.{0,1}(\d{1,2})?$/
      if (!regex.test(this.refundSumPrice)) {
        this.$MessageBox.alert('请填写有效的退款金额')
        return
      }
      if (this.refundSumPrice * 100 > this.realPrice) {
        this.$MessageBox.alert('退款金额大于实际付款金额')
        return
      }
      careOrderRefund.refundSumPrice = this.refundSumPrice * 100

      const htmls = `
          <i class="mint-icon-ok"></i>
          <p class="text-default">退款申请提交成功</p>
          <p class="font12 text-grey">工作人员将在三个工作日内与您联系，请耐心等待！</p>
        `
      let _this = this
      this.$MessageBox.confirm('确定申请退款吗？').then(() => {
        if (!this.$store.state.submit) {
          return
        }
        console.log(careOrderRefund)
        this.$store.commit('setSubmit', false)
        orderApi
          .refund(careOrderRefund)
          .then(() => {
            _this.$MessageBox
              .alert(htmls, {
                title: ''
              })
              .then(() => {
                this.$router.go(-1)
              })
          })
          .catch((e) => {
            if (e.data && e.data.errmsg) {
              _this.$MessageBox.alert(e.data.errmsg)
            } else {
              _this.$MessageBox.alert('申请失败，请稍后再试！')
            }
          })
          .finally(() => {
            this.$store.commit('setSubmit', true)
          })
      })
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    },
    linkfocus () {
      this.$nextTick(() => {
        console.log(44)
        let index = 0
        var timer = setInterval(() => {
          if (index < 1) {
            window.scroll(0, document.body.scrollTop + 100)
            index++
          } else {
            clearInterval(timer)
          }
        }, 600)
      })
    }
  }
}
</script>

<style lang="less">
.order-refund {
  h2 {
    margin: 10px auto 2px;
    color: @color-green;
    font-size: 22px;
  }
  a:visited {
    color: @color-green;
  }
  .mainInfo {
    padding: 10px 15px 20px;
    background-color: @color-white;
    .mint-cell-wrapper {
      padding: 0;
    }
    .mint-cell-label {
      color: @color-green;
    }
    .note {
      width: 100%;
      // height: 150px;
      // padding: 15px;
      box-sizing: border-box;
      border-radius: 1px;
      box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
      border: 0.5px solid rgba(236, 236, 243, 1);
      font-size: 16px;
      textarea {
        font-size: @font-size-small;
        padding: @m15;
        box-sizing: border-box;
        height: 150px;
      }
    }
  }
  .title {
    padding-bottom: 15px;
    li:first-child {
      line-height: 30px;
      box-shadow: inset 0px -0.5px 0px 0px rgba(141, 146, 158, 0.15);
    }
    .button {
      position: absolute;
      right: 15px;
    }
  }
}
</style>
