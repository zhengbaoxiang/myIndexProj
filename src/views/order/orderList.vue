<template>
  <div class="order-list">
    <my-header title="订单列表">
      <div>
        <div v-if="role === '4' || role === '7' || role === '3'" slot="right">
          <span @click="toCreate" class="font14 text-green">下单</span>
        </div>
      </div>
    </my-header>
    <mt-navbar
      v-model="selected"
      class="navbar-fixed"
      :style="{ top: topHeight + 'px', height: '44px' }"
    >
      <template v-if="role === '3' || role === '7'">
        <mt-tab-item id="5"
          >待处理
          <mt-badge v-show="todoOrderListNum" size="small" class="updated">{{
            todoOrderListNum > 99 ? "99+" : todoOrderListNum
          }}</mt-badge>
        </mt-tab-item>
        <mt-tab-item id="0">全部</mt-tab-item>
      </template>
      <template v-if="role === '4'">
        <mt-tab-item id="0">全部</mt-tab-item>
        <mt-tab-item id="1">待支付</mt-tab-item>
        <mt-tab-item id="8" v-if="depositDispatch === '1'">待缴存</mt-tab-item>
        <mt-tab-item id="9">待结单</mt-tab-item>
        <mt-tab-item id="3">退款/售后</mt-tab-item>
      </template>
      <template v-if="role === '2'">
        <mt-tab-item id="0">全部</mt-tab-item>
        <mt-tab-item id="1">待支付</mt-tab-item>
        <mt-tab-item id="2">待评价</mt-tab-item>
        <mt-tab-item id="3">退款/售后</mt-tab-item>
      </template>
    </mt-navbar>
    <div
      class="bg-white ptb10 plr15 selected-type fixed"
      :style="{ top: topHeight + 44 + 'px' }"
    >
      <my-inputsearch
        large
        path="orderList"
        placeholder="搜索"
        :value.sync="carerSearchText"
        @input="carerSearchText = arguments[0]"
      ></my-inputsearch>
    </div>
    <mt-loadmore
      :top-method="pageReload"
      :auto-fill="false"
      ref="orderLoadmoreRef"
      :style="{ 'padding-top': topHeight + 44 + 15 + 'px' }"
    >
      <ul
        class="cards"
        v-infinite-scroll="getOrderList"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="loading"
      >
        <li class="card" v-for="(item, index) in list" :key="index">
          <div class="card-top">
            <div @click="gotoPage(item)">
              <div class="clearfix">
                <span class="fl">{{ item.productBigTitle }}</span>
                <div
                  v-if="
                    role === '4' &&
                    (!item.hospitalizedCode ||
                      !item.agreeCode ||
                      !item.receiptCode)
                  "
                  style="display: inline-block"
                >
                  <i class="icon-tip"></i>
                </div>
                <span
                  class="fr font14 span-serviceStatus"
                  :class="{
                    'text-green': item.serviceStatus === 2,
                    'text-grey':
                      item.serviceStatus === 3 || item.serviceStatus == 4,
                  }"
                  >{{ item.serviceStatus | getServiceStatus }}</span
                >
              </div>
              <div class="clearfix mt5">
                <!--<mt-badge size="small" class="fl" type="success">护工</mt-badge>-->
                <mt-badge
                  v-if="
                    (role === '3' || role === '4' || role === '7') &&
                    item.payWay === 1
                  "
                  size="small"
                  class="fl cash"
                  >现金</mt-badge
                >
                <mt-badge
                  v-if="
                    role === '4' &&
                    item.payWay === 1 &&
                    item.depositStatus === 1
                  "
                  size="small"
                  class="fl behalf ml5"
                  >代缴</mt-badge
                >
                <mt-badge
                  v-if="item.payStatus !== 2"
                  size="small"
                  class="fr span-payStatus"
                  :type="item.payStatus | getStatusCss"
                  >{{ getPayStatus(item) }}</mt-badge
                >
              </div>
            </div>
          </div>
          <div class="card-middle">
            <div @click="gotoPage(item)">
              <ul>
                <li class="clearfix">
                  <span class="fl">被护理人</span>
                  <span class="fr">{{ item.patientName }}</span>
                </li>
                <li class="clearfix">
                  <span class="fl">开始时间</span>
                  <span class="fr">
                    {{ new Date(item.realStartTime).Format("yyyy年MM月dd日") }}
                  </span>
                </li>
                <li class="clearfix">
                  <span class="fl">
                    {{ item.endTime === null ? "已服务天数" : "服务天数" }}
                  </span>
                  <span
                    v-if="item.payStatus <= 2 || item.payStatus === 7"
                    class="fr"
                    >{{ item.realNum }}天</span
                  >
                  <span
                    v-if="item.payStatus >= 3 && item.payStatus <= 5"
                    class="fr boxNum"
                  >
                    <span class="text-red">
                      <span class="oldNum">{{ item.num }}</span
                      >天 →
                    </span>
                    <span>
                      <span class="newNum">
                        {{
                          item.num -
                          ((item.careOrderRefund && item.careOrderRefund.num) ||
                            0)
                        }} </span
                      >天
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-bottom clearfix plr15 pb15">
            <template
              v-if="
                item.priceChangeHandleStatus && (role === '3' || role === '7')
              "
            >
              <!-- 改价单的逻辑 管家-->
              <div
                v-if="item.changeReason || item.changeLanguage"
                class="appraiseNote p10 mb10 font12"
              >
                {{ (item.changeReason || "") + (item.changeLanguage || "") }}
              </div>
              <p>
                <span class="font12">实收 </span
                ><span class="myFont-DINPro-Medium font18"
                  >&yen;{{ (item.changePrice / 100).toFixed(2) }}</span
                >
              </p>
              <p class="text-red font12">
                原价 &yen;{{ (item.sumPrice / 100).toFixed(2) }}
              </p>
            </template>
            <template v-else-if="item.priceChangeHandleStatus && role === '4'">
              <!-- 改价单的逻辑 主管-->
              <div
                v-if="item.changeReason || item.changeLanguage"
                class="appraiseNote p10 mb10 font12"
              >
                {{ (item.changeReason || "") + (item.changeLanguage || "") }}
              </div>
              <p>
                <span class="myFont-DINPro-Medium font18"
                  >&yen;{{ (item.realPrice / 100).toFixed(2) }}</span
                >
              </p>
              <p class="text-red font12">改价中…</p>
            </template>
            <template v-else>
              <!-- 非改价单的逻辑 -->
              <div
                v-if="
                  item.payStatus >= 3 &&
                  item.payStatus <= 5 &&
                  item.careOrderRefund &&
                  (item.careOrderRefund.note ||
                    item.careOrderRefund.commonLanguage)
                "
                class="appraiseNote p10 mb10 font12"
              >
                {{
                  (item.careOrderRefund.note || "") +
                  (item.careOrderRefund.commonLanguage || "")
                }}
              </div>
              <template v-if="item.payStatus === 5 && item.careOrderRefund">
                <p>
                  <span class="font12">实收 </span
                  ><span class="myFont-DINPro-Medium font18"
                    >&yen;{{
                      (
                        (item.sumPrice -
                          item.careOrderRefund.realRefundSumPrice) /
                        100
                      ).toFixed(2)
                    }}</span
                  >
                </p>
                <p class="text-red font12">
                  <span>原价 &yen;{{ (item.sumPrice / 100).toFixed(2) }} </span>
                  <span
                    >退除 &yen;{{
                      (
                        item.careOrderRefund.realRefundSumPrice / 100 || 0
                      ).toFixed(2)
                    }}</span
                  >
                </p>
              </template>
              <template v-else>
                <p class="myFont-DINPro-Medium font18">
                  <template
                    v-if="
                      !item.endTime && item.priceKind === 1 && !item.sumPrice
                    "
                    >&yen;--</template
                  >
                  <template v-else>
                    <span v-if="item.payStatus === 3" class="font12"
                      >原价
                    </span>
                    &yen;{{ (item.sumPrice / 100).toFixed(2) }}</template
                  >
                </p>
                <p v-if="item.payStatus === 3" class="text-red font12">
                  退除 &yen;{{
                    (
                      (item.careOrderRefund &&
                        item.careOrderRefund.realRefundSumPrice / 100) ||
                      0
                    ).toFixed(2)
                  }}
                </p>
              </template>
            </template>
            <div
              class="abs"
              :class="{
                offline: item.payWay === 1 && entryLinkLogic.isWorker(),
              }"
            >
              <div class="toggle-more-button">
                <span
                  v-if="buttonLogic.moreButton(item)"
                  @click="
                    currentOrderId = item.id;
                    moreButtonPopupVisible = true;
                  "
                  class="mintui mintui-more text-grey mr15"
                ></span>
                <template v-if="currentOrderId === item.id">
                  <mt-popup
                    v-model="moreButtonPopupVisible"
                    popup-transition="popup-fade"
                    class="my-inner-mint-popup"
                  >
                    <p
                      v-if="buttonLogic.applayNewPrice(item)"
                      @click="
                        moreButtonPopupVisible = false;
                        showApplePopup(
                          item.id,
                          (item.sumPrice / 100).toFixed(2)
                        );
                      "
                    >
                      申请改价
                    </p>
                    <p
                      v-if="buttonLogic.cancelOrder(item)"
                      @click="
                        moreButtonPopupVisible = false;
                        cancelOrder(item.id);
                      "
                    >
                      取消订单
                    </p>
                    <p
                      v-if="buttonLogic.delayPay(item)"
                      @click="
                        moreButtonPopupVisible = false;
                        showDelayedPopup(item.id);
                      "
                    >
                      延迟付款
                    </p>
                    <p
                      v-if="buttonLogic.priceChangeApprove(item)"
                      @click="
                        moreButtonPopupVisible = false;
                        showApprovePopup(item, 2);
                      "
                    >
                      拒 绝
                    </p>
                    <p
                      v-if="buttonLogic.endOrder(item)"
                      @click="
                        moreButtonPopupVisible = false;
                        showEndpopup(item, (item.sumPrice / 100).toFixed(2));
                      "
                    >
                      结束订单
                    </p>
                  </mt-popup>
                </template>
                <mt-button
                  v-if="entryLinkLogic.showEvaluate(item)"
                  class="ml5"
                  size="small"
                  type="primary"
                  :id="`btn-${item.id}`"
                  @click.native="showAppraisePopup(item.id)"
                  >去评价</mt-button
                >
                <mt-button
                  v-if="
                    buttonLogic.delayPay(item) && !buttonLogic.moreButton(item)
                  "
                  class="ml5"
                  size="small"
                  type="primary"
                  @click.native="showDelayedPopup(item.id)"
                  >延迟付款</mt-button
                >
                <mt-button
                  v-if="
                    buttonLogic.cancelOrder(item) &&
                    !buttonLogic.moreButton(item)
                  "
                  class="ml5"
                  size="small"
                  type="primary"
                  @click.native="cancelOrder(item.id)"
                  >取消订单</mt-button
                >
                <mt-button
                  v-if="buttonLogic.pay(item)"
                  class="ml5"
                  size="small"
                  type="danger"
                  @click="gotoPage(item)"
                  >去支付</mt-button
                >
                <mt-button
                  v-if="
                    buttonLogic.applayNewPrice(item) &&
                    !buttonLogic.moreButton(item)
                  "
                  class="ml5"
                  size="small"
                  type="primary"
                  @click.native="
                    showApplePopup(item.id, (item.sumPrice / 100).toFixed(2))
                  "
                  >申请改价</mt-button
                >
                <mt-button
                  v-if="
                    buttonLogic.endOrder(item) && !buttonLogic.moreButton(item)
                  "
                  size="small"
                  class="my-btn ml5"
                  type="primary"
                  @click.native="
                    showEndpopup(item, (item.sumPrice / 100).toFixed(2))
                  "
                  >结束订单</mt-button
                >
                <mt-button
                  v-if="buttonLogic.cashOrderConfirm(item)"
                  class="ml5"
                  size="small"
                  type="primary"
                  @click.native="payCash(item.id)"
                  >确认收款</mt-button
                >
                <mt-button
                  v-if="depositDispatch === '1' && buttonLogic.appPay(item)"
                  size="small"
                  class="my-btn ml5"
                  type="primary"
                  @click.native="appPay(item.id)"
                  >线上缴存</mt-button
                >
                <!-- 改价单 -->
                <template>
                  <mt-button
                    v-if="
                      buttonLogic.priceChangeApprove(item) &&
                      !buttonLogic.moreButton(item)
                    "
                    class="ml5"
                    size="small"
                    type="primary"
                    @click.native="showApprovePopup(item, 2)"
                    >拒 绝</mt-button
                  >
                  <mt-button
                    v-if="buttonLogic.priceChangeApprove(item)"
                    class="ml5"
                    size="small"
                    type="primary"
                    @click.native="showApprovePopup(item, 1)"
                    >同意改价</mt-button
                  >
                </template>
                <!-- 待退款订单 -->
                <template>
                  <mt-button
                    v-if="
                      buttonLogic.refundApprove(item) &&
                      !buttonLogic.moreButton(item)
                    "
                    class="ml5"
                    size="small"
                    type="primary"
                    @click.native="showApprovePopup(item, 2)"
                    >拒 绝</mt-button
                  >
                  <mt-button
                    v-if="buttonLogic.refundApprove(item) && item.payWay !== 1"
                    class="ml5"
                    size="small"
                    type="primary"
                    @click.native="showApprovePopup(item, 1)"
                    >同意退款</mt-button
                  >
                  <mt-button
                    v-if="buttonLogic.refundApprove(item) && item.payWay === 1"
                    class="ml5"
                    size="small"
                    type="primary"
                    @click.native="showUploadPopup(item.id)"
                    >线下退款</mt-button
                  >
                </template>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <div v-show="allLoaded && list.length === 0" class="noOrders center">
      <img src="../../assets/imgs/noOrders.png" alt />
      <div class="word">暂无{{ selected | getTabStatus }}订单</div>
    </div>
    <my-tabbar current="订单" />
    <appraise-popup
      v-if="role === '2'"
      :visible.sync="appraisePopupVisible"
      :orderId="currentOrderId"
      @appraiseOk="appraiseOk"
    ></appraise-popup>
    <apply-popup
      :visible.sync="applyPopupVisible"
      :orderId="currentOrderId"
      :oldPrice="oldPrice"
      :isEndOrder="canChangePrice"
      @applyOk="applyOk"
      @applyCancel="applyCancel"
    ></apply-popup>
    <upload-popup
      :visible.sync="uploadPopupVisible"
      :orderId="currentOrderId"
      @uploadRefundOk="uploadRefundOk"
    ></upload-popup>
    <track-popup
      :visible.sync="trackPopupVisible"
      :orderId="currentOrderId"
      @trackOk="trackOk"
    ></track-popup>
    <approve-popup
      :visible.sync="approvePopupVisible"
      :approvePopupObj="approvePopupObj"
      @approveOk="approveOk"
    ></approve-popup>
    <delayed-popup
      :visible.sync="delayedPopupVisible"
      :orderId="currentOrderId"
      @delayOk="delayOk"
    ></delayed-popup>
    <end-popup
      :visible.sync="endPopupVisible"
      :orderId="currentOrderId"
      :canChangePrice="canChangePrice"
      @endOk="endOk"
      @needChangePrice="needChangePrice"
    ></end-popup>
  </div>
</template>

<script>
import { orderApi } from '@/assets/api'
import appraisePopup from './popup/appraisePopup'
import applyPopup from './popup/applyPopup'
import uploadPopup from './popup/uploadPopup'
import trackPopup from './popup/trackPopup'
import delayedPopup from './popup/delayedPopup'
import approvePopup from './popup/approvePopup'
import endPopup from './popup/endPopup'
import utils from '@/utils/myUtils'
import orderPay from '@/utils/pay'
import { buttonLogic, entryLinkLogic } from './orderLogic.js'

export default {
  data () {
    return {
      buttonLogic,
      entryLinkLogic,
      selected: null,
      role: utils.getItem('role'),
      todoOrderListNum: 0,
      list: [],
      carerSearchText: null,
      page: {
        pageSize: 10,
        pageNo: 0
      },
      timer: -1,
      loading: false,
      allLoaded: false,
      endPopupVisible: false,
      appraisePopupVisible: false,
      applyPopupVisible: false,
      uploadPopupVisible: false,
      trackPopupVisible: false,
      delayedPopupVisible: false,
      currentOrderId: -1,
      oldPrice: -1,
      moreButtonPopupVisible: false,
      approvePopupVisible: false,
      depositDispatch: null,
      canChangePrice: false,
      approvePopupObj: {},
      topHeight: 0
    }
  },
  components: {
    appraisePopup,
    applyPopup,
    uploadPopup,
    trackPopup,
    delayedPopup,
    approvePopup,
    endPopup
  },
  created () {
    // selected 回显
    if (this.$store.state.selectedInfo.selected) {
      this.selected = this.$store.state.selectedInfo.selected
    } else {
      this.selected = '0'
    }
    this.topHeight = this.role === '2' ? 36 : 44
    if (this.role === '4') {
      if (this.$store.state.depositDispatch === null) {
        // 待联调;
        orderApi
          .getOpenDeposit()
          .then((json) => {
            console.log('json--->', json)
            console.log('json.data.data--->', json.data.data)
            this.depositDispatch = this.$store.state.depositDispatch =
              json.data.data
          })
          .finally(() => {})
      } else {
        this.depositDispatch = this.$store.state.depositDispatch
      }
    }
    // carerSearchText 回显
    this.carerSearchText = this.$store.state.selectedInfo.carerSearchText || ''
  },
  activated () {
    this.loading = false
    console.log('orderList activated')
    if (this.role === '3' || this.role === '7') {
      // 获取待处理的数量
      orderApi
        .getOrderList(5, this.page.pageSize, this.page.pageNo)
        .then((json) => {
          this.todoOrderListNum = json.data.data.total
        })
    }
    if (this.$store.state.refreshNext.orderList) {
      this.$store.state.refreshNext.orderList = false
      // 在这里进行刷新操作
      this.pageReload()
    }
  },
  beforeDestroy () {
    this.$store.commit('setSelectedInfo', {
      selected: this.selected,
      carerSearchText: this.carerSearchText
    })
  },
  methods: {
    // 线下退款通过
    uploadRefundOk (ret) {
      let _id = this.currentOrderId
      this.uploadPopupVisible = false
      const curIndex = this.list.findIndex((m) => m.id === _id)
      this.list[curIndex].payStatus = 4
    },
    trackOk (id) {
      const curIndex = this.list.findIndex((m) => m.id === id)
      this.list[curIndex].priceChangeStatus = 0
      this.list[curIndex].payStatus = 2
    },
    delayOk (id) {
      const curIndex = this.list.findIndex((m) => m.id === id)
      this.list[curIndex].payStatus = 7
    },
    endOk () {
      const curIndex = this.list.findIndex((m) => m.id === this.currentOrderId)
      if (this.selected === '9' || this.selected === '5') {
        // 如果当前标签页为“待结单”/"待处理"，删除此条订单
        this.list.splice(curIndex, 1)
      } else {
        // 隐藏评价按钮
        this.list[curIndex].endTime = 1
      }
    },
    toCreate () {
      this.loading = true
      this.$router.push({
        name: 'valetCreate'
      })
    },
    gotoPage (item) {
      // 订单详情页面
      let name = 'orderDetail'
      this.loading = true
      this.$router.push({
        name: name,
        query: { orderId: item.id }
      })
    },
    // 订单列表 数据源初始化
    getOrderList () {
      if (this.loading) return
      this.loading = true
      this.page.pageNo = ++this.page.pageNo
      orderApi
        .getOrderList(
          this.selected,
          this.page.pageSize,
          this.page.pageNo,
          this.carerSearchText
        )
        .then((json) => {
          if (
            json.data.data &&
            json.data.data.list &&
            json.data.data.list.length > 0
          ) {
            this.list.push(...json.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          // 全部加载完成
          this.allLoaded = this.list.length >= json.data.data.total

          // 进入待处理，则刷新数量
          if (this.selected === '5') {
            this.todoOrderListNum = json.data.data.total
          }
        })
        .finally(() => {
          // 还有数据允许继续触发上滑加载更多。
          if (!this.allLoaded) {
            this.loading = false
          }
          this.$refs.orderLoadmoreRef.onTopLoaded()
        })
    },
    // 取消订单
    cancelOrder (orderId) {
      this.$MessageBox.confirm('确定取消该订单吗?').then((action) => {
        this.$Indicator.open({
          text: '正在取消...',
          spinnerType: 'fading-circle'
        })
        orderApi
          .cancelOrder(orderId)
          .then((json) => {
            this.$Toast({
              message: '订单取消成功',
              duration: 2000
            })
            const curIndex = this.list.findIndex((m) => m.id === orderId)
            this.list[curIndex].serviceStatus = 3
            this.list[curIndex].payStatus = 0
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
    showAppraisePopup (id) {
      this.currentOrderId = id
      this.appraisePopupVisible = true
    },
    showApplePopup (id, oldPrice) {
      this.currentOrderId = id
      this.oldPrice = oldPrice
      this.canChangePrice = false
      this.applyPopupVisible = true
    },
    showDelayedPopup (id) {
      this.currentOrderId = id
      this.delayedPopupVisible = true
    },
    showUploadPopup (id) {
      this.currentOrderId = id
      this.uploadPopupVisible = true
    },
    // 去评价
    appraiseOk () {
      const curIndex = this.list.findIndex((m) => m.id === this.currentOrderId)
      if (this.selected === '2') {
        // 如果当前标签页为“待评价”，删除此条订单
        this.list.splice(curIndex, 1)
      } else {
        // 隐藏评价按钮
        this.list[curIndex].evaluate1 = 5
      }
    },
    // 申请改价成功
    applyOk (obj) {
      if (!obj) {
        const curIndex = this.list.findIndex(
          (m) => m.id === this.currentOrderId
        )
        this.list[curIndex].priceChangeStatus = 0
        this.list[curIndex].priceChangeHandleStatus = 1
      } else {
        // 说明是从结束订单过来的 在这里调用结束订单并且改价
        console.log('obj', obj)
        this.endOrder(this.currentOrderId, 1, obj)
      }
    },
    applyCancel () {
      if (this.canChangePrice) {
        // 说明是从结束订单过来的 在这里调用结束订单但不改价
        this.endOrder(this.currentOrderId, 0)
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
    showApprovePopup (item, approve) {
      this.approvePopupVisible = true
      item.approve = approve
      this.approvePopupObj = item
      console.log(this.approvePopupObj)
    },
    approveOk (obj) {
      console.log('approveOk callback', obj)
      const curIndex = this.list.findIndex((m) => m.id === obj.id)
      if (this.selected === '5') {
        // 如果当前标签页为“待处理”，删除此条订单
        this.list.splice(curIndex, 1)
      } else {
        // 更新该订单
        this.list.splice(curIndex, 1, obj)
      }
      if (this.todoOrderListNum > 0) {
        this.todoOrderListNum--
      }
    },
    pageReload () {
      this.list = []
      this.page.pageNo = 0
      this.loading = false
      this.allLoaded = false
      this.getOrderList()
    },
    // 现金支付
    payCash (orderId) {
      this.currentOrderId = orderId
      this.trackPopupVisible = true
    },
    showEndpopup (orderInfo, oldPrice) {
      this.currentOrderId = orderInfo.id
      this.canChangePrice =
        orderInfo.priceKind === 1 && orderInfo.endTime === null
      console.log('this.canChangePrice---->', this.canChangePrice)
      this.oldPrice = oldPrice
      this.endPopupVisible = true
    },
    needChangePrice (orderId) {
      this.applyPopupVisible = true
    },
    getPayStatus: function (item) {
      switch (item.payStatus) {
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
    // 去支付
    async appPay (id) {
      let _this = this
      orderPay.appPay(id, (ret) => {
        console.log('payret', ret)
        if (ret === '0') {
          const curIndex = _this.list.findIndex(
            (m) => m.id === _this.currentOrderId
          )
          _this.list[curIndex].depositStatus = 1
        }
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
    },
    getTabStatus: function (value) {
      switch (value) {
        case '0':
          return ''
        case '1':
          return '待支付'
        case '2':
          return '待评价'
        case '3':
          return '退款/售后'
        case '4':
          return '未开始'
        case '5':
          return '待处理'
        case '6':
          return '待确认'
        case '7':
          return '待结单'
        default:
          return ''
      }
    }
  },
  watch: {
    selected (newval, oldval) {
      console.log('selectedpageReload')
      this.pageReload()
    },
    carerSearchText (newval, oldval) {
      if (oldval !== null) {
        clearTimeout(this.timer)
        let _this = this
        this.timer = setTimeout(() => {
          console.log('carerSearchTextpageReload')
          _this.pageReload()
        }, 400)
      }
    }
  }
}
</script>

<style lang="less" type="text/less">
.order-list {
  .navbar-fixed {
    position: fixed;
    // top: @head-height;
    right: 0;
    left: 0;
    z-index: 2;
    -webkit-box-shadow: 0 0.5px 0.5px 0 rgba(16, 47, 163, 0.07);
    box-shadow: 0 0.5px 0.5px 0 rgba(16, 47, 163, 0.07);
    .mint-tab-item {
      flex: auto;
      .updated {
        padding: 2px 5px;
        border-radius: 10px;
        background-color: red;
        position: absolute;
        top: 5px;
      }
    }
  }
  .selected-type {
    // top: 80px;
    right: 0;
    left: 0;
    z-index: 1;
  }
  .cards {
    // margin-top: @head-height + @m15 + 94px;
    padding-bottom: @footer-height + @m15;
    min-height: 400px;
  }
  .noOrders {
    position: absolute;
    top: 150px;
    pointer-events: none;
    z-index: -1;
    img {
      width: 50%;
      max-width: 378px;
    }
    .word {
      padding-top: @m15;
      color: rgba(141, 146, 158, 0.5);
    }
  }
  .card {
    margin: @m15 @m15 0 @m15;
    background-color: @background-white;
    box-shadow: 0 3px 8px 0 rgba(16, 47, 163, 0.07);
    .border_radius();
    &-top {
      padding: 15px 15px 20px 15px;
      .icon-tip {
        content: "";
        background: url("../../assets/imgs/detail_tip.png") center center
          no-repeat;
        //  background-image: url('../../assets/imgs/close@2x.png');
        background-size: 100% 100%;
        display: block;
        height: 16px;
        width: 16px;
        float: left;
        margin-top: 3px;
        margin-left: 2px;
      }
    }
    &-middle {
      position: relative;
      color: @color-grey;
      font-size: @font-size-small;
      padding: 10px 15px 15px;
      &::before {
        content: "";
        border-top: 1px solid @border-color;
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        transform: scaleY(0.5);
      }
      li {
        margin-top: 5px;
      }
    }
    &-bottom {
      position: relative;
      padding-top: @m15;
      &::before {
        content: "";
        border-top: 1px solid @border-color;
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        transform: scaleY(0.5);
      }
      .appraiseNote {
        background-color: rgba(197, 208, 224, 0.15);
      }
      p.font18 {
        line-height: 30px;
      }
      p.font12 {
        line-height: 17px;
      }
      .abs {
        bottom: 15px;
        right: 15px;
        &.offline button.mint-button--primary {
          background-color: rgba(219, 186, 127, 1);
          color: @color-white;
        }
      }
    }
    .mint-badge.is-primary {
      background-color: rgba(197, 208, 224, 0.15);
      color: @color-grey;
    }
    .mint-badge.is-primary.cash {
      background-color: rgba(219, 186, 127, 1);
      color: @color-white;
    }
    .mint-badge.is-primary.behalf {
      background-color: rgba(31, 193, 201, 0.1);
      color: @color-green;
    }
  }
  // .offline {
  //   background-color: rgba(219, 186, 127, 1);
  //   color: @color-white;
  // }
  .loading {
    text-align: center;
    width: 100px;
    margin: @m5 auto 0 auto;
    .word {
      vertical-align: 0;
      margin-left: @m5;
    }
  }
  .colorChange {
    background-color: #dbba7f 100%;
  }
}
</style>

<style lang="less">
.toggle-more-button {
  .my-inner-mint-popup {
    position: absolute;
    right: 30px;
    top: auto;
    left: auto;
    bottom: 30px;
    width: 80px;
    padding: 0 5px;
    transform: translate(-50%, 0);
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
    border-radius: 1px;
    p {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      border-bottom: 1px solid #ececf3;
      &:last-child {
        border-bottom: inherit;
      }
    }
    &::before {
      display: inline-block;
      width: 0;
      height: 0;
      border: solid transparent;
      border-width: 8px;
      border-top-color: #fff;
      content: "";
      position: absolute;
      z-index: 2;
      bottom: -16px;
      right: 20px;
    }

    & + * + .v-modal {
      background-color: transparent;
    }
  }
}
</style>
