<template>
  <div class="order-detail" v-if="orderInfo">
    <my-header title="订单详情">
      <div v-if="entryLinkLogic.isWorker()">
        <span class="font14 text-green" @click="isEdit = !isEdit" v-if="!isEdit">编辑</span>
        <span class="font14 text-green" @click="save()" v-if="isEdit">保存</span>
      </div>
    </my-header>
    <div class="pb65">
      <div class="save-tip center" v-if="role === '4' && !isEdit && showTip">
        <div style="display: inline-block;line-height: 25px;">
          <i class="save-icon-tip"></i>
          <span class="font12 text-red tip-words">订单信息不全，请尽快编辑完善</span>
        </div>
      </div>
      <div class="card p15">
        <div class="clearfix">
          <span class="fl" :class="{ 'text-light-grey': isEdit }">{{ orderInfo.productBigTitle }}</span>
          <span
            class="fr font14"
            :class="{
              'text-green': orderInfo.serviceStatus === 2,
              'text-grey':
                orderInfo.serviceStatus === 3 ||
                orderInfo.serviceStatus == 4 ||
                isEdit
            }"
          >{{ orderInfo.serviceStatus | getServiceStatus }}</span>
        </div>
        <div class="clearfix mt5">
          <mt-badge
            v-if="entryLinkLogic.isCashFlag(orderInfo)"
            size="small"
            class="fl isCash"
            type="success"
          >现金</mt-badge>
          <mt-badge
            v-if="entryLinkLogic.isDepositFlag(orderInfo)"
            size="small"
            class="fl behalf ml5"
          >代缴</mt-badge>
          <mt-badge
            v-if="orderInfo.payStatus !== 2"
            size="small"
            class="fr span-payStatus"
            :type="orderInfo.payStatus | getStatusCss"
          >{{ getPayStatus(orderInfo) }}</mt-badge>
        </div>
        <div class="mt10">
          <template v-if="orderInfo.priceChangeHandleStatus && role !== '2'">
            <!-- 改价单的逻辑 -->
            <p
              class="myFont-DINPro-Medium font18"
              :class="{ 'text-light-grey': isEdit }"
            >&yen;{{ (orderInfo.changePrice / 100).toFixed(2) }}</p>
            <p
              class="text-red font12"
              :class="{ 'text-light-grey': isEdit }"
            >原价 &yen;{{ (orderInfo.sumPrice / 100).toFixed(2) }}</p>
            <div
              v-if="orderInfo.changeReason || orderInfo.changeLanguage"
              class="appraiseNote p10 mt10 font12"
              :class="{ 'text-light-grey': isEdit }"
            >
              {{
              (orderInfo.changeReason || '') +
              (orderInfo.changeLanguage || '')
              }}
            </div>
          </template>
          <template v-else>
            <p>
              <span
                class="myFont-DINPro-Medium font18"
                :class="{ 'text-light-grey': isEdit }"
              >&yen; {{ ((orderInfo.sumPrice || 0) / 100).toFixed(2) }}</span>
            </p>
            <template v-if="orderInfo.payStatus >= 3 && orderInfo.payStatus <= 5">
              <!-- 退款单的逻辑 -->
              <p
                class="text-red font12"
                style="text-indent:3px;"
                :class="{ 'text-light-grey': isEdit }"
              >
                -&yen;
                {{
                (
                (orderInfo.careOrderRefund &&
                orderInfo.careOrderRefund.realRefundSumPrice / 100) ||
                0
                ).toFixed(2)
                }}
              </p>
              <p
                v-if="
                  orderInfo.careOrderRefund &&
                    (orderInfo.careOrderRefund.note ||
                      orderInfo.careOrderRefund.commonLanguage)
                "
                class="appraiseNote p10 mt10 font12"
                :class="{ 'text-light-grey': isEdit }"
              >
                {{
                (orderInfo.careOrderRefund.note || '') +
                (orderInfo.careOrderRefund.commonLanguage || '')
                }}
              </p>
            </template>
          </template>
        </div>
      </div>
      <div class="mt10 color-default">
        <mt-cell title="住院号" class="my-required">
          <slot name="right">
            <input
              v-model="orderInfo.hospitalizedCode"
              class="mint-field-core right"
              maxlength="15"
              placeholder="未填写"
              @input="filterCode(orderInfo.hospitalizedCode, 1)"
              @blur="restore"
              :readonly="!isEdit"
            />
          </slot>
        </mt-cell>
        <mt-cell title="三方协议单号" class="my-required">
          <slot name="right">
            <input
              v-model="orderInfo.agreeCode"
              class="mint-field-core right"
              maxlength="15"
              placeholder="未填写"
              @input="filterCode(orderInfo.agreeCode, 2)"
              @blur="restore"
              :readonly="!isEdit"
            />
          </slot>
        </mt-cell>
        <mt-cell title="收据单号" class="my-required">
          <slot name="right">
            <input
              v-model="orderInfo.receiptCode"
              class="mint-field-core right"
              maxlength="15"
              placeholder="未填写"
              @input="filterCode(orderInfo.receiptCode, 3)"
              @blur="restore"
              :readonly="!isEdit"
            />
          </slot>
        </mt-cell>
      </div>
      <div class="mt10" :class="[!isEdit ? 'color-default' : 'color-grey']">
        <mt-cell title="订单编号" :value="orderInfo.code"></mt-cell>
        <mt-cell
          title="下单时间"
          v-if="orderInfo.orderTime"
          :value="new Date(orderInfo.orderTime).Format('yyyy年MM月dd日')"
        ></mt-cell>
        <mt-cell
          title="支付时间"
          v-if="orderInfo.payTime"
          :value="new Date(orderInfo.payTime).Format('yyyy年MM月dd日')"
        ></mt-cell>
      </div>
      <div
        v-if="orderInfo.payStatus >= 3 && orderInfo.payStatus <= 5"
        class="mt10"
        :class="[!isEdit ? 'color-default' : 'color-grey']"
        >
        <mt-cell
          title="退款时间"
          v-if="
            orderInfo.careOrderRefund && orderInfo.careOrderRefund.approveTime
          "
          :value="
            new Date(orderInfo.careOrderRefund.approveTime).Format(
              'yyyy年MM月dd日'
            )
          "
        ></mt-cell>
        <mt-cell
          title="退款金额"
          v-if="
            orderInfo.careOrderRefund && orderInfo.careOrderRefund.approveTime
          "
          :value="
            '￥' +
              (orderInfo.careOrderRefund.realRefundSumPrice / 100).toFixed(2)
          "
        ></mt-cell>
        <div
          class="bg-white pt15"
          v-if="
            orderInfo.careOrderRefund &&
              orderInfo.careOrderRefund.approveTime &&
              orderInfo.careOrderRefund.refundCertificate
          "
        >
          <label class="mb10 mint-cell-wrapper">退款凭证</label>
          <my-imagegallery
            class="mlr15 pb15"
            :data="[orderInfo.careOrderRefund.refundCertificate]"
            imagegalleryIndex="refundImage"
          ></my-imagegallery>
        </div>
        <!-- <mt-cell title="流水号" v-if="orderInfo.seqNo" :value="orderInfo.seqNo"></mt-cell> -->
      </div>
      <div class="mt10 color-grey">
        <mt-cell title="被护理人" :value="orderInfo.patientName"></mt-cell>
        <mt-cell
          title="开始时间"
          v-if="orderInfo.realStartTime"
          :value="new Date(orderInfo.realStartTime).Format('yyyy年MM月dd日')"
        ></mt-cell>
        <div @click="showSelectedDate">
          <mt-cell v-if="orderInfo.payStatus >= 3 && orderInfo.payStatus <= 5" is-link title="服务天数">
            <slot name="right">
              <span class="text-red">{{ orderInfo.num }}天→</span>
              <span>
                {{
                orderInfo.num -
                ((orderInfo.careOrderRefund &&
                orderInfo.careOrderRefund.num) ||
                0)
                }}天
              </span>
            </slot>
          </mt-cell>
          <mt-cell v-else title="服务天数" is-link :value="`${orderInfo.realNum || 0}天`"></mt-cell>
        </div>
        <mt-cell title="服务医院" :value="orderInfo.campusName"></mt-cell>
        <mt-cell title="科室/病区" :value="orderInfo.districtName"></mt-cell>
        <mt-cell v-if="!isEdit" title="床位" :value="orderInfo.bedName"></mt-cell>
        <div v-else @click="getBeds">
          <mt-cell title="床位">
            <slot name="right">
              <span class="pr15">
                <input
                  class="mint-field-core right"
                  readonly
                  :value="orderInfo.bedName"
                  placeholder="请选择床位"
                  unselectable="on"
                  onfocus="this.blur()"
                />
                <i class="mint-cell-allow-right"></i>
              </span>
            </slot>
          </mt-cell>
        </div>
        <mt-cell title="联系人" :value="orderInfo.linkMan"></mt-cell>
        <mt-cell title="联系电话" :value="orderInfo.linkTelephone"></mt-cell>
        <div
          class="mt10"
          v-if="entryLinkLogic.associateOrderQR(orderInfo)"
          @click="associateOrderQR(id)"
        >
          <mt-cell title="订单二维码">
            <slot name="right">
              <span class="pr15">
                <i class="mint-cell-allow-right"></i>
              </span>
            </slot>
          </mt-cell>
        </div>
        <mt-cell
          class="mt10"
          v-if="orderInfo.distributeStatus !== 0"
          title="服务护工"
          is-link
          :to="{ name: 'careworkerList', query: { orderId: orderInfo.id } }"
        ></mt-cell>
        <mt-cell
          class="mt10"
          v-if="entryLinkLogic.showServiceLog(orderInfo)"
          title="护理日志"
          is-link
          :to="{ name: 'serviceLog', query: { orderId: orderInfo.id } }"
        ></mt-cell>
        <mt-cell
          class="mt10"
          v-if="entryLinkLogic.showEvaluate(orderInfo)"
          title="去评价"
          is-link
          @click.native="appraisePopupVisible = true"
        ></mt-cell>
      </div>
    </div>
    <div
      class="footer center"
      :class="{ offline: orderInfo.payWay === 1 && entryLinkLogic.isWorker() }"
      v-if="!isEdit"
    >
      <mt-button
        v-if="buttonLogic.copyOrder(orderInfo)"
        size="large"
        type="primary"
        plain
        @click.native="copyOrder(orderInfo)"
      >续单</mt-button>
      <mt-button
        v-if="buttonLogic.cancelOrder(orderInfo)"
        size="large"
        type="primary"
        @click.native="cancelOrder"
      >取消订单</mt-button>
      <mt-button
        v-if="buttonLogic.refundApply(orderInfo)"
        size="large"
        type="primary"
        plain
        @click.native="refundClick"
      >退款申请</mt-button>
      <mt-button
        v-if="buttonLogic.refundEndApply(orderInfo)"
        size="large"
        type="primary"
        plain
        @click.native="refundClick"
      >发起售后</mt-button>
      <mt-button
        v-if="buttonLogic.endOrder(orderInfo)"
        size="large"
        type="primary"
        @click.native="endPopupVisible = true"
      >结束订单</mt-button>
      <mt-button
        v-if="buttonLogic.suggest(orderInfo)"
        plain
        size="large"
        type="primary"
        @click.native="suggestRecent"
      >
        建议与反馈
        <mt-badge v-if="newSuggest" size="small" style="background-color:red" class="updated"></mt-badge>
      </mt-button>
      <mt-button v-if="buttonLogic.pay(orderInfo)" size="large" type="danger" @click="toPay">去支付</mt-button>
      <mt-button
        v-if="depositDispatch === '1' && buttonLogic.appPay(orderInfo)"
        size="large"
        type="primary"
        @click.native="appPay(id)"
      >线上缴存</mt-button>
      <mt-button
        v-if="buttonLogic.applayNewPrice(orderInfo)"
        size="large"
        type="primary"
        @click.native="applyPopupVisible = true"
      >申请改价</mt-button>
      <mt-button
        v-if="buttonLogic.delayPay(orderInfo)"
        size="large"
        type="primary"
        @click.native="delayedPopupVisible = true"
      >延迟付款</mt-button>
      <mt-button
        v-if="buttonLogic.cashOrderConfirm(orderInfo)"
        size="large"
        type="primary"
        @click.native="trackPopupVisible = true"
      >确认收款</mt-button>
      <template v-if="buttonLogic.refundApprove(orderInfo)">
        <mt-button size="large" type="primary" @click.native="showApprovePopup(2)">拒 绝</mt-button>
        <mt-button
          v-if="orderInfo.payWay !== 1"
          size="large"
          type="primary"
          @click.native="showApprovePopup(1)"
        >同意退款</mt-button>
        <mt-button
          v-if="orderInfo.payWay === 1"
          size="large"
          type="primary"
          @click.native="uploadPopupVisible = true"
        >线下退款</mt-button>
      </template>
      <template v-if="buttonLogic.priceChangeApprove(orderInfo)">
        <mt-button size="large" type="primary" @click.native="showApprovePopup(2)">拒 绝</mt-button>
        <mt-button size="large" type="primary" @click.native="showApprovePopup(1)">同意改价</mt-button>
      </template>
    </div>
    <selected-date
      title="服务天数"
      pattern="view"
      v-model="selectedDateVisible"
      :data="serviceList"
      :refundData="refundList"
    ></selected-date>
    <appraise-popup
      v-if="role === '2'"
      :visible.sync="appraisePopupVisible"
      :orderId="id"
      @appraiseOk="appraiseOk"
    ></appraise-popup>
    <apply-popup
      :visible.sync="applyPopupVisible"
      :orderId="id"
      :oldPrice="((orderInfo.sumPrice || 0) / 100).toFixed(2)"
      :isEndOrder="canChangePrice"
      @applyOk="applyOk"
      @applyCancel="applyCancel"
    ></apply-popup>
    <upload-popup :visible.sync="uploadPopupVisible" :orderId="id" @uploadRefundOk="uploadRefundOk"></upload-popup>
    <track-popup :visible.sync="trackPopupVisible" :orderId="id" @trackOk="trackOk"></track-popup>
    <approve-popup
      :visible.sync="approvePopupVisible"
      :approvePopupObj="approvePopupObj"
      @approveOk="approveOk"
    ></approve-popup>
    <delayed-popup :visible.sync="delayedPopupVisible" :orderId="id" @delayOk="delayOk"></delayed-popup>
    <end-popup
      :visible.sync="endPopupVisible"
      :orderId="id"
      :canChangePrice="canChangePrice"
      @endOk="endOk"
      @needChangePrice="needChangePrice"
    ></end-popup>
    <pay-popup :visible.sync="payPopupVisible" :orderId="id" @payOk="payOk"></pay-popup>
    <offline-popup :visible.sync="offlinePayShow" :orderId="id" @offlinePayOk="offlinePayOk"></offline-popup>
    <!-- 床位弹窗 -->
    <my-actionsheet
      title="请选择床位"
      v-if="bed.sheetVisible"
      v-model="bed.sheetVisible"
      :data="bed.sheetList"
      @change="bedSelected"
    ></my-actionsheet>
  </div>
</template>

<script>
import { orderApi, mineApi } from '@/assets/api'
import appraisePopup from './popup/appraisePopup'
import applyPopup from './popup/applyPopup'
import uploadPopup from './popup/uploadPopup'
import selectedDate from './popup/selectedDate'
import utils from '@/utils/myUtils'
import SDK from '@/utils/SDK'
import trackPopup from './popup/trackPopup'
import delayedPopup from './popup/delayedPopup'
import approvePopup from './popup/approvePopup'
import payPopup from './popup/payPopup'
import endPopup from './popup/endPopup'
import offlinePopup from './popup/offlinePopup'
import orderPay from '@/utils/pay'
import { buttonLogic, entryLinkLogic } from './orderLogic'

export default {
  data () {
    return {
      id: 0,
      buttonLogic,
      entryLinkLogic,
      role: utils.getItem('role'),
      orderInfo: null,
      appraisePopupVisible: false,
      applyPopupVisible: false,
      uploadPopupVisible: false,
      selectedDateVisible: false,
      trackPopupVisible: false,
      delayedPopupVisible: false,
      payPopupVisible: false,
      endPopupVisible: false,
      offlinePayShow: false,
      newSuggest: false,
      needPay: false,
      orderMap: null,
      suggestId: null,
      replyTime: null,
      timer: null,
      serviceList: [],
      refundList: [],
      approvePopupVisible: false,
      depositDispatch: null,
      canChangePrice: false,
      approvePopupObj: {},
      isEdit: false,
      showTip: false,
      bed: {
        totalData: [],
        sheetList: [],
        sheetVisible: false
      },
      orignInfo: null
    }
  },
  components: {
    selectedDate,
    appraisePopup,
    applyPopup,
    uploadPopup,
    trackPopup,
    delayedPopup,
    approvePopup,
    payPopup,
    offlinePopup,
    endPopup
  },
  created () {
    // 所以在这里屏蔽ios的config配置,防止调用失败
    if (
      !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ||
      this.$route.query.fromWechat === '1'
    ) {
      SDK.getWXConfig()
    }
    // 初始化页面元素
    this.id = this.$route.query.orderId || 0
    this.orderDetailInit()
    // 初始化页面样式
    if (this.role === '2') {
      this.orderMap =
        utils.jsonToMap(window.localStorage.getItem('orderMap')) || new Map()
      this.replyTime = this.orderMap.get('order_' + this.id)
      console.log('orderMap', this.orderMap)
      console.log('replyTime', this.replyTime)
      this.getNewSuggest()
      this.timer = setInterval(() => {
        this.getNewSuggest()
      }, 10000)
    }
    if (this.entryLinkLogic.isWorker()) {
      if (this.$store.state.depositDispatch === null) {
        // 待联调
        orderApi
          .getOpenDeposit()
          .then((json) => {
            this.depositDispatch = this.$store.state.depositDispatch =
              json.data.data
          })
          .finally(() => {})
      } else {
        this.depositDispatch = this.$store.state.depositDispatch
      }
    }
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    needChangePrice () {
      this.applyPopupVisible = true
    },
    // 支付弹窗回调
    payOk (status) {
      console.log('payOk', status)
      if (status === 1) {
        this.wxpay()
      } else if (status === 2) {
        this.offlinePayShow = true
      }
    },
    offlinePayOk () {
      this.$Indicator.open('正在为您自动跳转...')
      let time = 2
      var thisTimer = setInterval(() => {
        time--
        if (time < 0) {
          this.$Indicator.close()
          clearInterval(thisTimer)
          window.location.href =
            window.hcsConfig.domain + '/order/list?default=user'
        }
      }, 500)
    },
    // 订单支付逻辑,统一弹窗
    toPay () {
      // 展示弹窗
      this.payPopupVisible = true
    },
    // 去支付
    async wxpay () {
      let _this = this
      orderPay.wxpay(this.id, (ret) => {
        console.log('wxpayret', ret)
        if (!ret) {
          _this.orderInfo = null
          _this.orderDetailInit()
        } else if (ret === 'cancel' && _this.needPay) {
          _this.needPay = false
          _this.orderInfo = null
          _this.orderDetailInit()
        }
      })
    },
    async appPay (id) {
      let _this = this
      orderPay.appPay(id, (ret) => {
        if (ret === '0') {
          _this.orderInfo.depositStatus = 1
          _this.initHeight()
        }
      })
    },
    refundClick () {
      this.$router.push({
        name: 'orderRefund',
        query: {
          orderId: this.id
        }
      })
    },
    // 点击保存按钮 调用函数
    save () {
      // 护工主管保存修改数据
      const arg = {
        id: this.id,
        bedId: this.orderInfo.bedId,
        hospitalizedCode: this.orderInfo.hospitalizedCode,
        receiptCode: this.orderInfo.receiptCode,
        agreeCode: this.orderInfo.agreeCode
      }
      orderApi
        .updateOrder(arg)
        .then(() => {
          this.$MessageBox.alert('保存成功!')
          if (
            !this.orderInfo.hospitalizedCode ||
            !this.orderInfo.agreeCode ||
            !this.orderInfo.receiptCode
          ) {
            console.log(
              this.orderInfo.hospitalizedCode &
                this.orderInfo.agreeCode &
                this.orderInfo.receiptCode
            )
            this.showTip = true
          } else {
            this.showTip = false
          }
          this.orderInfo = null
          this.isEdit = false
          this.orderDetailInit()
          this.initHeight()
        })
        .catch((e) => {
          let msg = e.data.errmsg ? e.data.errmsg : '保存失败，请稍后再试！'
          this.$MessageBox.alert(msg)
        })
    },
    trackOk (id) {
      this.orderInfo = null
      this.orderDetailInit()
      this.initHeight()
    },
    delayOk (id) {
      this.orderInfo.payStatus = 7
      this.initHeight()
    },
    endOk (id) {
      this.endPopupVisible = false
      this.orderInfo = null
      this.initHeight()
      this.orderDetailInit()
    },
    approveOk (obj) {
      console.log('callback', obj)
      this.orderInfo = obj
      this.initHeight()
    },
    uploadRefundOk (ret) {
      this.orderInfo = null
      this.uploadPopupVisible = false
      this.orderDetailInit()
    },
    // 评价成功回调方法
    appraiseOk () {
      // 隐藏评价按钮
      this.orderInfo.evaluate1 = 5
      this.initHeight()
    },
    applyOk (obj) {
      // 隐藏申请改价按钮
      if (!obj) {
        this.orderInfo.priceChangeStatus = 0
        this.initHeight()
      } else {
        // 说明是从结束订单过来的 在这里调用结束订单并且改价
        console.log('obj', obj)
        this.endOrder(this.id, 1, obj)
      }
    },
    applyCancel () {
      if (this.canChangePrice) {
        // 说明是从结束订单过来的 在这里调用结束订单但不改价
        this.endOrder(this.id, 0)
      }
    },
    endOrder (id, whetherChangePrice, changePriceObj) {
      let _this = this
      orderApi
        .endOrder(id, whetherChangePrice)
        .then((response) => {
          if (whetherChangePrice === 0) {
            _this.$Toast({
              message: '结束订单成功!',
              duration: 2000
            })
            // 在这里进行回显操作
            _this.endOk()
          } else {
            changePriceObj = {
              orderId: id,
              changePrice: changePriceObj.changePrice,
              changeReason: changePriceObj.changeReason,
              languageIdList: changePriceObj.languageIdList
            }
            _this.changeApply(changePriceObj)
          }
        })
        .catch((e) => {
          console.log('e', e)
          console.log('e', e.data.errmsg)
          this.$Toast({
            message: '结束订单失败，' + e.data.errmsg,
            duration: 2000
          })
        })
        .finally(() => {})
    },
    changeApply (obj) {
      orderApi
        .changeApply(obj)
        .then((response) => {
          this.endOk()
          this.applyOk()
          this.$Toast({
            message: '申请提交成功!',
            duration: 2000
          })
        })
        .catch((e) => {
          this.$Toast({
            message: '申请提交失败，' + e.data.errmsg,
            duration: 2000
          })
        })
    },
    showSelectedDate () {
      if (this.serviceList.length > 0) {
        this.selectedDateVisible = true
      }
    },
    // 订单详情 数据源初始化
    orderDetailInit () {
      orderApi
        .getOrderDetail(this.id)
        .then((json) => {
          if (json.data.data) {
            this.orderInfo = json.data.data
            if (
              this.orderInfo.priceKind === 1 &&
              this.orderInfo.endTime === null
            ) {
              this.canChangePrice = true
            }
            this.orignInfo = JSON.stringify(this.orderInfo)
            if (
              !this.orderInfo.hospitalizedCode ||
              !this.orderInfo.agreeCode ||
              !this.orderInfo.receiptCode
            ) {
              this.showTip = true
            }
            this.judgeAppraiseWinOpen()
            // 进入详情页数据
            this.serviceList = json.data.data.serviceDates
            if (
              json.data.data.careOrderRefund &&
              json.data.data.careOrderRefund.approveStatus &&
              (json.data.data.careOrderRefund.approveStatus === 0 ||
                json.data.data.careOrderRefund.approveStatus === 1)
            ) {
              this.refundList = json.data.data.careOrderRefund.refundDates // 只有审批状态为待审批和审批通过时显示退款天数
            }
          } else {
            this.$MessageBox.alert('订单数据异常，请稍后重试！！').then(() => {
              this.$router.go(-1)
            })
          }
        })
        .catch((e) => {
          // 临时方案 解决从推送跳转的异常展示
          if (e.data && e.data.errcode && e.data.errcode !== '0004') {
            this.$MessageBox.alert('订单数据异常，请稍后重试！！').then(() => {
              this.$router.go(-1)
            })
          }
        })
    },
    // 请求处理是否更新了建议
    suggestRecent () {
      if (this.orderInfo.serviceStatus !== 2) {
        this.$router.push({
          name: 'suggestList',
          query: {
            orderId: this.id
          }
        })
        return
      }
      let name
      mineApi
        .getRecentSuggest(this.id)
        .then((resp) => {
          console.log('resp', resp)
          name = resp.data.data.id ? 'suggestList' : 'suggest'
        })
        .catch((e) => {
          console.log('e', e)
          name = 'suggestList'
        })
        .finally(() => {
          if (name === 'suggestList') {
            this.$router.push({
              name: name,
              query: {
                orderId: this.id,
                orderStatus:
                this.orderInfo.serviceStatus === 2 ? 'true' : 'false'
              }
            })
          } else {
            this.$router.push({
              name: name,
              query: {
                orderId: this.id
              }
            })
          }
        })
    },
    getNewSuggest () {
      mineApi.getRecentSuggest(this.id).then((resp) => {
        let ret = resp.data.data
        if (
          (!this.replyTime && ret.replyTime) ||
          (this.replyTime && ret.replyTime > this.replyTime)
        ) {
          this.newSuggest = true
          this.replyTime = ret.replyTime
          // 提示完红点后,就可以停止请求了
          if (this.timer) clearInterval(this.timer)
        }
      })
    },
    showApprovePopup (approve) {
      this.approvePopupVisible = true
      this.orderInfo.approve = approve
      this.approvePopupObj = this.orderInfo
      console.log(this.approvePopupObj)
    },
    // 取消订单
    cancelOrder () {
      this.$MessageBox.confirm('确定取消该订单吗?').then((action) => {
        this.$Indicator.open({
          text: '正在取消...',
          spinnerType: 'fading-circle'
        })
        orderApi
          .cancelOrder(this.id)
          .then((json) => {
            this.$Toast({
              message: '订单取消成功',
              duration: 2000
            })
            this.orderInfo.serviceStatus = 3
            this.orderInfo.payStatus = 0
            this.initHeight()
          })
          .catch((e) => {
            this.$Toast({
              message: '订单取消失败',
              duration: 2000
            })
          })
          .finally(() => {
            this.$Indicator.close()
          })
      })
    },
    // 在详情页进行操作后,返回列表页时高度会不够,这是初始化高度为0,使列表页返回顶部
    initHeight () {
      // this.$store.state.refreshNextPage = true
      this.$store.state.refreshNext.orderList = true
    },
    // 是否传出评价窗口
    judgeAppraiseWinOpen () {
      // 从微信消息页面进来的
      console.log('judgeAppraiseWinOpen')
      console.log('evaluate1', this.orderInfo.evaluate1)
      if (this.$route.query.evaluate === '1') {
        if (
          this.role !== '4' &&
          (this.orderInfo.serviceStatus === 3 ||
            this.orderInfo.serviceStatus === 4) &&
          this.orderInfo.payStatus &&
          !this.orderInfo.evaluate1
        ) {
          console.log('222222222222222')
          // 未评价需弹窗
          this.appraisePopupVisible = true
        }
        if (
          this.role !== '4' &&
          (this.orderInfo.serviceStatus === 3 ||
            this.orderInfo.serviceStatus === 4) &&
          this.orderInfo.payStatus &&
          this.orderInfo.evaluate1
        ) {
          // 已评价不需弹窗
          this.$Toast({
            message: '您已评价！',
            duration: 2000
          })
        }
      }
    },
    filterCode (code, number) {
      if (!code) return
      var pattern = /[^A-Za-z0-9[\]#\-\s\n]/g // 大小写字母 数字 - # 符号
      if (number === 1) {
        this.orderInfo.hospitalizedCode = code.replace(pattern, '')
      } else if (number === 2) {
        this.orderInfo.agreeCode = code.replace(pattern, '')
      } else {
        this.orderInfo.receiptCode = code.replace(pattern, '')
      }
    },
    // 获取床位信息
    getBeds () {
      orderApi.getOrderBed(this.orderInfo.districtId).then((data) => {
        const list = data.data.data.list
        this.bed.sheetList = [
          {
            flex: 1,
            values: list.map((m) => {
              return m.name
            })
          }
        ]
        this.bed.totalData = list
        this.bed.sheetVisible = true
      })
    },
    // 选中的床位
    bedSelected (val) {
      this.orderInfo.bedId = this.bed.totalData.filter((m) => {
        return m.name === val[0]
      })[0].id
      this.orderInfo.bedName = val[0]
    },
    getPayStatus: function (info) {
      switch (info.payStatus) {
        case 0:
          return '已取消'
        case 1:
          return '待支付'
        case 2:
          return '已支付'
        case 3:
          return '待退款'
        case 4:
          return '退款中'
        case 5:
          return '退款成功'
        case 6:
          return '退款失败'
        case 7:
          return '延迟支付'
        default:
          return ''
      }
    },
    copyOrder (order) {
      let _orderInfo = {
        serviceId: order.serviceId,
        bedId: order.bedId,
        bedContent: order.bedName,
        locId: order.districtId,
        locContent: order.districtName,
        payMode: order.payMode,
        serviceDates: [],
        originServiceDates: order.serviceDates,
        patientName: order.patientName,
        linkMan: order.linkMan,
        linkTelephone: order.linkTelephone
      }
      this.$store.commit('setOrderInfo', _orderInfo)
      this.$router.replace({
        name: 'valetCreate'
      })
    },
    // 调用生成场景值二维码后生成图片
    associateOrderQR (orderId) {
      this.$Indicator.open('正在加载...')
      orderApi
        .associateOrderQR(orderId)
        .then((data) => {
          const TICKET = data.data.data.ticket
          if (TICKET) {
            this.$Indicator.close()
            this.$MessageBox({
              title: '',
              closeOnClickModal: false,
              confirmButtonText: '关 闭',
              message:
                '<p class="text-default ptb10">微信扫描二维码接收订单</p><img width="80%" src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' +
                TICKET +
                '">'
            })
          }
        })
        .catch((e) => {
          this.$Indicator.close()
          let msg = e.data ? e.data.errmsg : '获取二维码失败！'
          this.$MessageBox.alert(msg)
        })
    }
  },
  filters: {
    getServiceStatus: function (value) {
      switch (value) {
        case 0:
          return '服务未开始' // 待确认状态
        case 1:
          return '服务未开始'
        case 2:
          return '服务中'
        case 3:
          return '已结束'
        case 4:
          return '已结束'
        case 5:
          return '服务中' // 待结单状态
        case 6:
          return '服务未开始' // 信息有误状态
        default:
          return ''
      }
    },
    getStatusCss: function (value) {
      switch (value) {
        case 1:
          return 'error'
        case 3:
          return 'warning'
        case 7:
          return 'error'
        default:
          return 'primary'
      }
    }
  }
}
</script>

<style lang="less" type="text/less">
.color-default {
  .mint-cell-text,
  .mint-cell-value {
    color: @color-default;
  }
}
.color-grey {
  .mint-cell-text,
  .mint-cell-value {
    color: @color-grey;
  }
}

.order-detail {
  .save-tip {
    height: 27px;
    background-color: rgba(254, 245, 243, 1);
    .save-icon-tip {
      content: "";
      background: url("../../assets/imgs/info_tip.png") center center no-repeat;
      //  background-image: url('../../assets/imgs/close@2x.png');
      background-size: 100% 100%;
      display: block;
      height: 12px;
      width: 12px;
      float: left;
      margin-top: 7.5px;
      margin-right: 5px;
    }
    // .tip-words {
    // }
  }
  .card {
    /*height: 115px;*/
    background-color: @background-white;
    .text-light-grey {
      color: rgba(141, 146, 158, 0.5);
    }
  }
  .img-list {
    margin: 0 15px;
    padding-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    li {
      width: calc(93% / 3);
      height: calc(93% / 3);
      padding-top: calc(93% / 3);
      margin-right: 3.5%;
      margin-bottom: 0;
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    li:nth-of-type(3n) {
      margin-right: 0;
    }
    li:nth-last-of-type(n + 4) {
      margin-bottom: 3.5%;
    }
  }
  .mint-badge.is-primary {
    background-color: rgba(197, 208, 224, 0.15);
    color: @color-grey;
  }
  .appraiseNote {
    background-color: rgba(197, 208, 224, 0.15);
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    .flex();
    button {
      .flex-num(1);
      border-radius: 0;
      &:first-child::before {
        content: none !important;
      }
    }
    // 幽灵订单
    .mint-button--primary.is-plain {
      color: @color-green;
      background-color: @background-white;
      border: 0 none;
      border-top: 1px solid #f8f8f8;
    }
    // 处理分割线
    button.mint-button--primary::before {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      margin-top: -11px;
      width: 0;
      height: 22px;
      border-left: 0.5px solid rgba(209, 253, 255, 1);
    }
    // 重置现金订单
    &.offline button.mint-button--primary {
      background-color: rgba(219, 186, 127, 1);
      color: @color-white;
      border-top: 0;
      &::before {
        border-left: 0.5px solid #fdfdfd;
      }
    }
  }
  .updated {
    padding: 2px 2px;
    margin-left: 3px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .img {
    height: 105px;
    width: 105px;
    border-radius: 100px;
  }
  .mint-badge.is-primary.behalf {
    background-color: rgba(31, 193, 201, 0.1);
    color: @color-green;
  }
  .isCash {
    background-color: rgba(219, 186, 127, 1);
    color: @color-white;
  }
}
</style>
