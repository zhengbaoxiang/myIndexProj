<template>
  <div class="valet-order">
    <my-header title="下单"></my-header>
    <div>
      <mt-cell title="服务名称">
        <slot name="right">
          <span
            @click="getServiceList"
            class="pr15"
          >
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.serviceName"
              placeholder="请选择服务"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="收费标准">
        <input
          v-model="editPrice"
          class="mint-field-core right"
          placeholder="请填写"
          type="number"
          ref="editPriceRef"
          @input="filterPrice(editPrice)"
        />
        <span
          class="text-default"
          v-if="editPrice && orderInfo.priceKind === 1"
        >/天</span>
        <span
          class="text-default"
          v-if="editPrice && orderInfo.priceKind === 2"
        >/全包</span>
      </mt-cell>
      <mt-cell
        title="结单时计费"
        v-if="orderInfo.priceKind === 1"
      >
        <mt-switch
          v-model="noEndTimeFlag"
          @change="changenoEndTime"
        ></mt-switch>
      </mt-cell>
      <mt-cell
        v-if="orderInfo.priceKind === 1 && !noEndTimeFlag"
        title="服务天数"
      >
        <slot name="right">
          <span
            @click="getStartTimes"
            class="pr15"
          >
            <input
              class="mint-field-core right"
              readonly
              :value="totalDates"
              placeholder="请选择日期"
              unselectable="on"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell
        v-else
        title="服务开始时间"
      >
        <slot name="right">
          <span
            @click="getStartTimes"
            class="pr15"
          >
            <input
              class="mint-field-core right"
              readonly
              :value="
                orderInfo.serviceDates[0]
                  ? new Date(orderInfo.serviceDates[0]).Format('yyyy年MM月dd日')
                  : ''
              "
              placeholder="请选择日期"
              unselectable="on"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell
        title="订单总价"
        v-if="orderInfo.priceKind === 1 && !noEndTimeFlag"
      >&yen; {{ Number(editPrice * orderInfo.serviceDates.length).toFixed(2) }}
      </mt-cell>
      <mt-cell
        title="订单总价"
        v-if="orderInfo.priceKind === 2"
      >&yen; {{ Number(editPrice).toFixed(2) }}
      </mt-cell>
    </div>
    <div
      class="mt10"
      v-if="!noEndTimeFlag"
    >
      <mt-cell title="延迟付款">
        <mt-switch v-model="payDelayFlag"></mt-switch>
      </mt-cell>
    </div>
    <div class="mt10">
      <mt-cell title="科室/病区">
        <slot name="right">
          <span
            @click="getLocs"
            class="pr15"
          >
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.locContent"
              placeholder="请选择科室"
              unselectable="on"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="床位">
        <slot name="right">
          <span
            @click="getBeds"
            class="pr15"
          >
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.bedContent"
              placeholder="请选择床位"
              unselectable="on"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <!-- 联系人信息 -->
      <mt-cell title="被护理人">
        <slot name="right">
          <input
            v-model="orderInfo.patientName"
            class="mint-field-core right"
            placeholder="必填"
            maxlength="8"
            @input="orderInfo.patientName = validateName(orderInfo.patientName)"
          />
        </slot>
      </mt-cell>
      <mt-cell title="联系人">
        <slot name="right">
          <input
            v-model="orderInfo.linkMan"
            class="mint-field-core right"
            placeholder="建议填写"
            maxlength="8"
            @input="orderInfo.linkMan = validateName(orderInfo.linkMan)"
          />
        </slot>
      </mt-cell>
      <mt-cell title="联系电话">
        <slot name="right">
          <input
            v-model="orderInfo.linkTelephone"
            class="mint-field-core right"
            placeholder="建议填写"
          />
        </slot>
      </mt-cell>
    </div>
    <div class="hr-65"></div>
    <div class="bottom fixed flex">
      <mt-button
        type="primary"
        size="large"
        @click="valetCreate()"
      >下单</mt-button>
    </div>
    <!-- 服务开始时间弹窗 -->
    <selected-date
      :title="orderInfo.priceKind === 2 || this.noEndTimeFlag ? '请选择开始时间' : '请选择日期'"
      pattern="order"
      v-model="starttime.sheetVisible"
      :selectedmaxLimit="
        orderInfo.priceKind === 2 || this.noEndTimeFlag ? 1 : 0
      "
      :data="orderInfo.serviceDates"
      :originDates="orderInfo.originServiceDates"
      @change="starttimeSelected"
      @selectedDate="serviceDatesInit"
    ></selected-date>
    <!-- 科室/院区弹窗 -->
    <my-actionsheet
      title="请选择科室"
      v-model="location.sheetVisible"
      :data="location.sheetList"
      @change="locSelected"
    ></my-actionsheet>
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
import { homeApi, orderApi } from '@/assets/api'
import utils from '@/utils/myUtils'
import selectedDate from './popup/selectedDate'

export default {
  name: 'orderCreate',
  data () {
    return {
      noEndTimeFlag: false, // 结单后计费，否
      payDelayFlag: false, // 延迟付款， 否
      queryOrderId: this.$route.query.orderId,
      role: utils.getItem('role'),
      editPrice: null, // 页面可编辑价格，单位元
      orderInfo: {
        // 服务信息
        serviceId: -1,
        serviceName: '',
        priceKind: 1, // '计价方式，1-按天计价，2-全包价',
        serviceRealPrice: 0, // 服务原价，单位分
        // 选择天数或开始时间
        serviceDates: [],
        startTime: -1,
        starttimeContent: '',
        // 被护理人信息
        locId: -1,
        locContent: '',
        bedId: -1,
        bedContent: '',
        patientName: '',
        linkMan: '',
        linkTelephone: '',
        payMode: 1
      },
      // 是否改价
      selectedCampusId: window.localStorage.getItem('selectedCampusId'),
      starttime: {
        sheetList: [],
        sheetVisible: false
      },
      location: {
        totalData: [],
        sheetList: [],
        sheetVisible: false
      },
      bed: {
        totalData: [],
        sheetList: [],
        sheetVisible: false
      }
    }
  },
  components: { selectedDate },
  computed: {
    formTips () {
      if (this.orderInfo.serviceId < 0) return '请选择服务'
      if (this.editPrice < 0 || this.editPrice > 1000000) return '请输入合理的金额'
      if (!this.orderInfo.serviceDates.length) return '请选择开始时间'
      if (!this.orderInfo.locContent) return '请选择科室'
      if (!this.orderInfo.bedContent) return '请选择床位'
      if (!this.orderInfo.patientName) return '请添加被护理人'
      if (!utils.validatePhoneAllowEmpty(this.orderInfo.linkTelephone)) {
        return '手机号码格式不正确'
      } else return false
    },
    totalDates () {
      return this.orderInfo.serviceDates.length > 0
        ? this.orderInfo.serviceDates.length + '天'
        : ''
    }
  },
  mounted () {
    this.getStateOrder(this.$store.state.orderInfo)
  },
  methods: {
    async getStateOrder (orderInfo) {
      const _serviceId = orderInfo.serviceId
      if (_serviceId) {
        console.log('77777777777777777777777777777')
        // 清空原来的OrderInfo
        this.$store.commit('setOrderInfo', {})
        console.log('this.orderInfo', this.orderInfo)
        try {
          const _data = await homeApi.serviceDetail(_serviceId)
          console.log(_data)
          const _serviceDetail = _data.data.data
          this.orderInfo = orderInfo
          this.orderInfo.serviceName = _serviceDetail.bigTitle
          this.orderInfo.priceKind = _serviceDetail.kind
          this.orderInfo.serviceRealPrice = _serviceDetail.realPrice
          this.editPrice = this.orderInfo.serviceRealPrice / 100
          if (!this.orderInfo.payMode) {
            this.payDelayFlag = true
          }
          this.$nextTick(() => {
            this.$refs.editPriceRef.focus()
          })
        } catch (error) {
          this.$MessageBox('请重新选择套餐！')
        }
      }
    },
    // 跳转到服务列表选择一项服务
    getServiceList () {
      this.$store.commit('setOrderInfo', this.orderInfo)
      this.$router.push({
        name: 'serviceList',
        query: {
          select: true,
          hospitalId: this.selectedCampusId
        }
      })
    },
    // 处理从今天开始往后一个月的日期
    getStartTimes () {
      let dateList = new Array(30).fill(0).map((item, i) => {
        return new Date(new Date().getTime() + i * 1000 * 24 * 60 * 60).Format(
          'MM月dd日'
        )
      })
      this.starttime.sheetList = [
        {
          flex: 1,
          values: dateList
        }
      ]
      this.starttime.sheetVisible = true
    },
    // 选中的开始服务时间
    starttimeSelected (val) {
      const month = val[0].substr(0, 2)
      const day = val[0].substr(3, 2)
      this.orderInfo.starttimeContent = val[0]
      this.orderInfo.startTime = new Date(
        new Date().getFullYear(),
        month - 1,
        day
      ).getTime()
    },
    // 选中的日期列表
    serviceDatesInit (val) {
      this.orderInfo.serviceDates = val
    },
    changenoEndTime () {
      this.orderInfo.serviceDates = []
      console.log('this.noEndTime', this.noEndTimeFlag)
    },
    // 获取科室病区信息
    getLocs () {
      orderApi
        .getLocation(this.selectedCampusId)
        .then((data) => {
          const list = data.data.data.list
          if (!list || !list.length) {
            return this.$MessageBox.alert('没有可以选择的科室')
          }
          this.location.sheetList = [
            {
              flex: 1,
              values: list.map((m) => {
                return m.name
              })
            }
          ]
          this.location.totalData = list
          this.location.sheetVisible = true
        })
        .catch(() => {
          this.$MessageBox.alert('数据异常，请重试！')
        })
    },
    // 选中的科室/病区
    locSelected (val) {
      // 清空选择的病床数据
      this.bed = {
        totalData: [],
        sheetList: [],
        sheetVisible: false
      }
      this.orderInfo.bedContent = ''
      this.orderInfo.bedId = -1
      // 写科室/病区数据
      this.orderInfo.locContent = val[0]
      this.orderInfo.locId = this.location.totalData.filter((m) => {
        return m.name === val[0]
      })[0].id
    },
    // 获取床位信息
    getBeds () {
      if (this.orderInfo.locId < 0) {
        return this.$MessageBox.alert('请先选择科室/病区')
      }
      orderApi.getOrderBed(this.orderInfo.locId).then((data) => {
        const list = data.data.data.list
        if (!list || !list.length) {
          return this.$MessageBox.alert('没有床位， 请更换科室/病区')
        }
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
    validateName (name) {
      return utils.filterEmojiStrict(name)
    },
    filterPrice (price) {
      this.editPrice = utils.filterPrice(price)
    },
    // 选中的床位
    bedSelected (val) {
      this.orderInfo.bedId = this.bed.totalData.filter((m) => {
        return m.name === val[0]
      })[0].id
      this.orderInfo.bedContent = val[0]
    },
    // 下单或保存
    async valetCreate (id) {
      // 校验是否已经全部填写信息
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      try {
        let _orderInfo = Object.assign({}, this.orderInfo)

        _orderInfo.customizedPrice =
          this.editPrice * 100 === this.orderInfo.serviceRealPrice
            ? null
            : this.editPrice * 100

        if (_orderInfo.priceKind === 1) {
          _orderInfo.noEndTime = this.noEndTimeFlag ? 1 : 0
        }
        _orderInfo.payMode = this.payDelayFlag || _orderInfo.noEndTime ? 0 : 1 // 是否延迟付款 ，0-延迟付款，1-待付款
        _orderInfo.payWay = 1 // '支付方式，0-线上,1-线下现金',
        _orderInfo.num = this.orderInfo.serviceDates.length
        _orderInfo.realNum = this.orderInfo.serviceDates.length

        this.$Indicator.open('正在加载...')

        const result = await orderApi.confirm(_orderInfo)

        console.log(result)
        this.$Indicator.close()
        this.initHeight()

        this.$MessageBox({
          message: '下单成功！',
          confirmButtonText: '立即查看'
        }).then((action) => {
          if (result.data.data.id) {
            this.$router.replace({
              name: 'orderDetail',
              query: {
                orderId: result.data.data.id
              }
            })
          } else {
            this.$router.replace({
              name: 'orderList'
            })
          }
        })
        this.$store.commit('setSubmit', true)
      } catch (e) {
        let msg = e.data ? e.data.errmsg : '提交失败，请稍后再试！'
        this.$MessageBox.alert(msg)
        this.$store.commit('setSubmit', true)
        this.$Indicator.close()
      }
    },
    // 在详情页进行操作后,返回列表页时高度会不够,这是初始化高度为0,使列表页返回顶部
    initHeight () {
      // this.$store.state.refreshNextPage = true
      this.$store.state.refreshNext.orderList = true
    }
  }
}
</script>

<style lang="less">
input:disabled {
  background-color: @background-white;
  color: #8d929e;
}
.valet-order {
  .mint-cell-title {
    min-width: 30%; // 防止改价原因过长展示不正常
  }
  .changeReason {
    padding: 20px 15px 18px 15px;
    .appraiseNote {
      background-color: rgba(197, 208, 224, 0.15);
    }
  }
  .show-box-shadow {
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.1);
    padding-top: 52px;
    position: relative;
    .mint-cell:first-child {
      background-color: #1fc1c9;
      box-shadow: 0px 4px 10px 0px rgba(86, 165, 156, 0.3);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      z-index: 0;
      .mint-cell-text {
        color: #ffffff;
      }
    }
  }
  .bottom {
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
      &::before {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        margin-top: -11px;
        width: 0;
        height: 22px;
        border-left: 0.5px solid rgba(209, 253, 255, 1);
      }
      &:first-child::before {
        content: none;
      }
    }
  }
}
</style>
