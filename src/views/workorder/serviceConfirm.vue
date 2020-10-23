<template>
  <div class="service-confirm">
    <my-header :title="isConfirm?'服务确认':'服务预约'"></my-header>
    <div v-if="pageItem">
      <div class="serviceInfo">
        <!-- 上部卡片 -->
        <ul class="title mlr15 ptb20 plr15">
          <li class="clearfix">
            <span class="fl font20">{{pageItem.bedName}}</span>
            <div class="fl ml5">
              <mt-badge size="small">{{pageItem.districtName}}</mt-badge>
            </div>
            <mt-badge
              v-if="isConfirm"
              size="normal"
              class="num"
              :style="pageItem.sumRealCount===pageItem.sumTotalCount? 'background-color: rgba(199, 199, 204, 1);font-size: 14px':'' "
            >{{getCompStatus(pageItem.sumRealCount,pageItem.sumTotalCount)}}</mt-badge>
          </li>
          <li class="clearfix mt10">
            <span class="fl">{{pageItem.patientName}}</span>
            <span class="fr">{{pageItem.productBigTitle}}</span>
          </li>
          <li class="clearfix text-grey font14">
            <span class="special-border-right10 rel pr5">{{sexFormat(pageItem.sex)}}</span>
            <span class="special-border-right10 rel plr5">{{pageItem.age}}岁</span>
            <span class="rel plr5">{{selfCareFormat(pageItem.selfCare)}}</span>
          </li>
        </ul>
        <div class="process">
          <!-- 服务确认 -->
          <div v-if="isConfirm" class="center">
            <!-- 正常子项 -->
            <div v-if="pageItem.careOrderServiceLog.kind === 0" class="mlr15">
              <div class="mb10 font20">
                <span>{{pageItem.careOrderServiceLog.serviceItemName}}</span>
                <span
                  v-if="pageItem.careOrderServiceLog.itemTotalCount > 0"
                >{{'('+pageItem.careOrderServiceLog.itemRealCount +'/'+pageItem.careOrderServiceLog.itemTotalCount +')'}}</span>
              </div>
              <div v-if="pageItem.careOrderServiceLog.itemTotalCount  > 0">
                <mt-badge
                  v-if=" pageItem.careOrderServiceLog.itemRealCount  < pageItem.careOrderServiceLog.itemTotalCount "
                  size="small"
                  class="unfinish mb15"
                >本项服务未完成</mt-badge>
                <mt-badge v-else size="small" class="finished mb15">本项服务已完成</mt-badge>
              </div>
            </div>
            <!-- 附加服务 -->
            <div v-else>
              <div class="mb5 font20">附加服务</div>
              <div class="select-tip">
                <div
                  v-for="(option, index) in options"
                  :class="{'checked':selectOptions.indexOf(option.id) >-1 }"
                  @click="selectAdditionTip(option)"
                  :key="index"
                >{{option.name}}</div>
              </div>
            </div>
            <div
              class="mint-field-core textarea"
              v-if="(pageItem.careOrderServiceLog.kind !== 0 && showAddTextarea ) ||
                (pageItem.careOrderServiceLog.kind === 0)"
            >
              <textarea
                :placeholder="pageItem.careOrderServiceLog.kind === 0 ?'备注说明,无法服务必填':'附加服务备注说明'"
                maxlength="20"
                rows="4"
                v-model="note"
                class="mint-field-core"
                ref="input"
                @input="filterNote(note)"
                @blur="restore"
              ></textarea>
              <!-- 常用标签选择框 -->
              <my-select-tips
                v-if="pageItem.careOrderServiceLog.kind === 0"
                :options="options"
                @input="selectTipsOk"
              ></my-select-tips>
              <my-voiceinput class="mb10" @recordOk="recordOk"></my-voiceinput>
            </div>
            <!-- 服务确认结束 -->
          </div>
          <!-- 服务预约 -->
          <div v-else class="center">
            <div
              v-if="workerInfo.callTime"
              class="mb5 font20"
            >{{'预约时间: ' + dateFormat(workerInfo.callTime,'yyyy-MM-dd hh:mm')}}</div>
            <mt-badge
              v-if="workerInfo.workerList.length ===0"
              size="small"
              class="unfinish mb5"
            >本次预约未响应</mt-badge>
            <mt-badge v-else size="small" class="finished mb5">本次预约已响应</mt-badge>
          </div>
          <!-- 服务人员列表 -->
          <ul class="mlr15 workers" v-if="workerInfo.workerList.length > 0">
            <li
              class="OrderWorkerLog clearfix mtb10"
              v-for="(workerLog, index) in workerInfo.workerList"
              :key="index"
              :style="workerLog.note || workerLog.commonLanguage || workerLog.completeStatus !== 0? '':'line-height: 42px'"
            >
              <div class="fl left center">
                <mt-badge
                  size="small"
                  class="index"
                  :style="workerLog.completeStatus !== 0? ' background-color:rgba(242, 121, 103, 1);':'background-color:rgba(199, 199, 204, 1)'"
                ></mt-badge>
              </div>
              <div class="fl mr15 left">
                <img :src="path + workerLog.imgUrl" alt="暂无图片" @error="_imageError" />
              </div>
              <div class="clearfix">
                <p>
                  <span class="mr10 font14">{{workerLog.workerName}}</span>
                  <span class="font12">{{ dateFormat(workerLog.careTime ) }}</span>
                </p>
                <p>
                  <mt-badge
                    size="small"
                    v-if="workerLog.completeStatus !== 0"
                    class="mr10 unfinish"
                  >
                    <span class="font10">无法服务</span>
                  </mt-badge>
                  <mt-badge
                    size="small"
                    class="mr10"
                    :class="{'unfinish':workerLog.completeStatus !== 0}"
                    v-if="workerLog.commonLanguage"
                  >
                    <span class="font10">{{workerLog.commonLanguage}}</span>
                  </mt-badge>
                </p>
                <p>
                  <span v-if="workerLog.note" class="font12 text-grey">“{{workerLog.note}}”</span>
                </p>
              </div>
            </li>
          </ul>
          <div v-if="!isConfirm &&workerInfo.workerList.length === 0" class="noLog center">
            <img src="../../assets/imgs/noResponse@2x.png" />
          </div>
        </div>
      </div>
      <div class="footer center">
        <mt-button
          v-if="isConfirm && !timeCount && pageItem.careOrderServiceLog.kind === 0 "
          size="large"
          class="my-btn btn-refund"
          type="primary"
          @click="confirmService(1)"
        >无法服务</mt-button>
        <mt-button
          v-if="isConfirm && !timeCount && pageItem.careOrderServiceLog.kind === 0 "
          size="large"
          class="my-btn"
          type="primary"
          @click="confirmService(0)"
        >确认服务</mt-button>
        <!-- 附加服务按钮 -->
        <mt-button
          v-if="isConfirm && !timeCount && pageItem.careOrderServiceLog.kind !== 0"
          size="large"
          class="my-btn"
          type="primary"
          @click="confirmService(-1)"
        >确认服务</mt-button>
        <mt-button
          v-if="isConfirm && timeCount  && pageItem.careOrderServiceLog.kind === 0  "
          size="large"
          class="my-btn btn-untime"
          type="primary"
          disabled
        >{{timeCount}}</mt-button>
        <mt-button
          v-if="!isConfirm && workerInfo.workerList.length ===0 && role == '5'"
          size="large"
          class="my-btn"
          type="primary"
          @click="callConfirm()"
        >前往服务</mt-button>
      </div>
    </div>
    <div class="noPermission center" v-else-if="noPession">
      <img src="../../assets/imgs/noPermission.png" alt />
    </div>
  </div>
</template>
<script>
import { workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'
export default {
  name: 'serviceConfirm',
  data () {
    return {
      role: utils.getItem('role'),
      isConfirm: this.$route.query.orderServiceItemId || null,
      path: window.hcsConfig.imgURL,
      remarkVisible: false,
      timeCount: '',
      note: '',
      id: this.$route.query.orderServiceItemId || this.$route.query.id,
      pageItem: null,
      workerInfo: {
        callTime: null,
        workerList: []
      },
      noPession: false,
      timeInfo: null,
      options: [],
      selectOptions: [],
      selectNoteOptions: [],
      showAddTextarea: false
    }
  },
  created () {
    // document.html.style.height = '100%'
    // document.html.style.backgroundColor = '#ffffff'
    // document.body.style.height = '100%'
    // document.body.style.backgroundColor = '#ffffff'
    this.isConfirm = this.$route.query.orderServiceItemId || null
    this.isConfirm ? this.getCareOrderNote() : this.getCall()
  },
  mounted () {
    document
      .querySelector('body')
      .setAttribute('style', 'background-color:#ffffff;height:100%')
  },
  beforeDestroy () {
    document.querySelector('body').removeAttribute('style')
    // document.body.style.backgroundColor = '#F5F5FA'
  },
  methods: {
    recordOk (val) {
      // this.note = this.note + val
      this.note = utils.noteLimit(this.note + val, 20)
    },
    // 用于标准服务时的常用语回显
    selectTipsOk (val) {
      console.log('val--->', val)
      if (val) {
        this.selectOptions = [val]
      } else {
        this.selectOptions = []
      }
    },
    selectAdditionTip (tip) {
      let index = this.selectOptions.indexOf(tip.id)
      this.selectOptions = []
      this.selectNoteOptions = []
      if (index < 0) {
        this.selectOptions.push(tip.id)
        this.selectNoteOptions.push(tip.name)
      }
      this.showAddTextarea = this.selectOptions.length > 0 && tip.id === 0
    },
    // 获取确认服务时常用语列表
    getCommonLanguage () {
      // 先注释掉待联调
      workOrderApi.getCommonLanguage({ languageType: 3 }).then(resp => {
        console.log('respresp', resp)
        this.options = resp.data.data
      })
    },
    getServiceStandard (orderId) {
      // 先注释掉待联调
      // standardType:1标准服务 2为附加服务
      workOrderApi
        .getServiceStandard({ orderId: orderId, standardType: 2 })
        .then(resp => {
          console.log('getServiceStandard', resp)
          this.options = resp.data.data
          this.options.push({
            id: 0,
            name: '其他',
            disabled: 0
          })
        })
    },
    // 回退到上一页面
    gotoServiceTrack () {
      this.isConfirm
        ? this.$router.go(-1)
        : this.$router.replace({ name: 'serviceTrack' })
    },
    // 护工抢单服务
    callConfirm () {
      if (!this.$store.state.submit) {
        return
      }
      // 锁定支付按钮
      this.$store.commit('setSubmit', false)
      workOrderApi
        .callConfirm(this.id)
        .then(resp => {
          this.$MessageBox.alert('抢单成功,请及时进行服务').then(() => {
            this.goHistory()
          })
        })
        .catch(e => {
          this.$MessageBox.alert(e.data.errmsg).then(() => {
            this.goHistory()
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    // 护工确认服务
    confirmService (status) {
      if (status === 1 && this.note === '' && this.selectOptions.length === 0) {
        // 拉起键盘填写备注
        this.$Toast('请填写备注或点选常用语后提交')
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
        return
      }
      if (
        status === -1 &&
        (this.selectOptions.length === 0 ||
          (this.selectOptions[0] === 0 && this.note === ''))
      ) {
        // 拉起键盘填写备注
        this.$Toast('请选择服务项或填写备注后提交')
        if (this.selectOptions[0] === 0) {
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        }
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      // 在这里要把selectOptions也作为参数传递到后台
      // 当服务为标准服务时,selectOptions代表护工选择的常用语id的集合
      // 当服务为附加服务时,selectOptions代表护工选择的标准附加服务项id的集合
      let param =
        status !== -1
          ? {
            orderServiceLogId: this.pageItem.careOrderServiceLog.id,
            completeStatus: status === 1 ? 1 : 0,
            note: this.note,
            languageIdList: this.selectOptions
          }
          : {
            orderServiceLogId: this.pageItem.careOrderServiceLog.id,
            completeStatus: status === 1 ? 1 : 0,
            note: this.note || this.AdditionNoteFormat(),
            additionList:
                this.selectOptions.length > 0 && this.selectOptions[0] !== 0
                  ? this.selectOptions
                  : null
          }
      workOrderApi
        .sendWorkerLog(param)
        .then(response => {
          this.$MessageBox.alert('服务确认成功!').then(() => {
            // this.$store.state.refreshNextPage = true
            this.$store.state.refreshNext.serviceTrack = true
            this.$router.replace({ name: 'serviceTrack' })
          })
        })
        .catch(e => {
          this.$Toast({
            message: '服务确认失败，' + e.data.errmsg || '请稍后再试',
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    // 拼接用户选择的附加服务项名字作为备注返回给后台
    AdditionNoteFormat () {
      let ret = ''
      this.selectNoteOptions.forEach(note => {
        ret = ret + note + ','
      })
      return ret.substr(0, ret.length - 1)
    },
    dateFormat (time, fmt) {
      return new Date(time).Format(fmt || 'yyyy-MM-dd hh:mm:ss')
    },
    getCall () {
      workOrderApi
        .getCall(this.id)
        .then(resp => {
          this.pageItem = resp.data.data
          let _careCallVO = this.pageItem.careCallVO
          this.workerInfo.callTime = _careCallVO.callTime
          if (_careCallVO.responseWorkerName) {
            let _data = {
              note: '',
              completeStatus: 0,
              imgUrl: _careCallVO.getResponseWorkerImg,
              workerName: _careCallVO.responseWorkerName,
              careTime: _careCallVO.responseTime
            }
            this.workerInfo.workerList.push(_data)
          }
        })
        .catch(e => {
          if (e.data.errcode === '0007') {
            this.noPession = true
          } else {
            this.$MessageBox.alert(e.data.errmsg).then(() => {
              this.$router.go(-1)
            })
          }
        })
    },
    // 获取页面元素信息
    getCareOrderNote () {
      workOrderApi
        .getCareOrderNote(this.id)
        .then(resp => {
          this.pageItem = resp.data.data
          this.workerInfo.workerList = this.pageItem.careOrderServiceLog.careWorkerLogs
          this.timeInfo = {
            // 时间相关的参数 进行赋值简化
            done: this.pageItem.careOrderServiceLog.careWorkerLogs.length,
            total: this.pageItem.careOrderServiceLog.itemTotalCount,
            lastTime: this.pageItem.careOrderServiceLog.recentCareTime,
            interval: this.pageItem.careOrderServiceLog.minTimeInterval
          }
          if (this.pageItem.careOrderServiceLog.kind === 0) {
            // 若为标准项,则获取常用语列表
            this.getCommonLanguage()
          } else {
            // 若为附加服务项,则获取附加服务列表
            console.log(this.pageItem.careOrderServiceLog.orderId)
            this.getServiceStandard(this.pageItem.careOrderServiceLog.orderId)
            // this.options = [
            //   { id: 1, name: 'name1' },
            //   { id: 2, name: 'name2' },
            //   { id: 3, name: 'name3' },
            //   { id: 4, name: 'name4' },
            //   { id: 5, name: 'name5' },
            //   { id: 6, name: 'name6' }
            // ]
          }
          // 如果仍可完成且有时间间隔 判断是否展示倒计时
          // this.timeInfo.done !== this.total &&
          if (this.timeInfo.lastTime && this.timeInfo.interval) {
            this.countTime()
          }
        })
        .catch(e => {
          if (e.data.errcode === '0007') {
            this.noPession = true
          } else {
            this.$MessageBox.alert(e.data.errmsg).then(() => {
              this.$router.go(-1)
            })
          }
        })
    },
    // 倒计时
    countTime () {
      var now = new Date().getTime()
      var lastTime = new Date(this.timeInfo.lastTime)
      var end = lastTime.getTime() + this.timeInfo.interval * 60 * 1000
      var leftTime = end - now
      if (leftTime >= 0) {
        let h = this.timeFormat(Math.floor((leftTime / 1000 / 60 / 60) % 24))
        let m = this.timeFormat(Math.floor((leftTime / 1000 / 60) % 60))
        let s = this.timeFormat(Math.floor((leftTime / 1000) % 60))
        this.timeCount = h + ':' + m + ':' + s
        setTimeout(this.countTime, 1000)
      } else {
        this.timeCount = ''
        clearTimeout(this.countTime)
      }
    },
    getCompStatus (comp, total) {
      return comp === total ? '已完成' : comp + '/' + total
    },
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
    },
    selfCareFormat: function (selfCare) {
      switch (selfCare) {
        case 1:
          return '自理'
        case 2:
          return '半自理'
        case 3:
          return '不能自理'
        default:
          return ''
      }
    },
    timeFormat: function (value) {
      return value >= 10 ? value : '0' + value
    },
    filterNote (note) {
      this.note = utils.filterEmoji(note)
    }
  }
}
</script>
<style lang="less" scoped>
.service-confirm {
  position: relative;
  .serviceInfo {
    position: absolute;
    height: 110px;
    width: 100%;
    background: url("../../assets/imgs/bg-servicedetail.png") no-repeat;
    background-size: 100% 100%;
    .title {
      margin-top: 30px;
      position: relative;
      background-color: @color-white;
      box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
      overflow: hidden;
      .border_radius();
      li:first-child {
        height: 28px;
        line-height: 28px;
      }
      .font20 {
        height: 28px;
      }
      .ml5 {
        height: 24px;
        line-height: 24px;
        .mint-badge.is-size-small {
          height: 14px;
          line-height: 14px;
          background-color: rgba(252, 236, 181, 1);
          color: rgba(193, 151, 5, 1);
        }
      }
      .num {
        position: absolute;
        top: 23px;
        right: 0;
        padding-left: @m15;
        padding-right: @m15;
        border-radius: 100px 0px 0px 100px;
        line-height: 18px;
        font-size: 16px;
      }
    }
    .process {
      padding: 30px 0 52px 0;
      background-color: rgba(255, 255, 255, 1);
      .select-tip {
        margin: 15px 15px 0 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        div {
          // float: left;
          font-size: 18px;
          padding: 5px 10px;
          line-height: 21px;
          // margin-bottom: 10px;
          // margin-right: 15px;
          margin: 0 5px 10px 5px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 1);
          border: 0.5px solid rgba(0, 0, 0, 0.1);
        }
        .checked {
          color: rgba(31, 193, 201, 1);
          border: 0.5px solid transparent;
          background-color: rgba(31, 193, 201, 0.1);
        }
      }
      .textarea {
        margin: 0 20px;
        width: calc(100% - 40px);
        box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
        background-color: rgba(255, 255, 255, 1);
        border: 0.5px solid rgba(236, 236, 243, 1);
        overflow: hidden;
        textarea {
          font-size: @font-size-small;
          padding: @m15;
          height: 90px;
          box-sizing: border-box;
        }
      }
      .workers {
        .OrderWorkerLog {
          .left {
            height: 42px;
            width: 42px;
            line-height: 42px;
            img {
              border-radius: 5px;
              height: 100%;
              width: 100%;
            }
          }
          p {
            .line-clamp(1);
          }
          .index {
            padding: 3px 3px;
            border-radius: @m5;
          }
        }
      }
      .noLog {
        margin-top: 30px;
        img {
          width: 50%;
          max-width: 378px;
        }
      }
    }
    .unfinish {
      color: @color-red;
      background-color: rgba(242, 121, 103, 0.08);
    }
    .finished {
      color: @color-green;
      background-color: rgba(31, 193, 201, 0.1);
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
    }
    .btn-refund {
      color: rgba(141, 146, 158, 1);
      background-color: @background-white;
      border-top: 1px solid #f8f8f8;
    }
    .btn-untime {
      background-color: rgba(141, 146, 158, 1);
      opacity: 1;
    }
    .has-border-left:before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -11px;
      width: 0;
      height: 22px;
      border-left: 0.5px solid rgba(209, 253, 255, 1);
    }
  }
  .noPermission {
    margin-top: 102px;
    img {
      width: 50%;
      max-width: 378px;
    }
  }
}
</style>
