<template>
  <div class="order-confirm">
    <my-header title="护理信息"></my-header>
    <div>
      <mt-cell title="服务名称">
        <slot name="right">
          <input v-model="orderInfo.serviceName" disabled class="mint-field-core right white" />
        </slot>
      </mt-cell>
      <mt-cell :title="orderInfo.kind === 1 ?'服务天数': '开始时间'">
        <slot name="right">
          <span @click="getStartTimes" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.kind === 1 ?
              (orderInfo.serviceDates.length > 0? orderInfo.serviceDates.length + '天' :'')
              : (orderInfo.serviceDates.length > 0 ?new Date(orderInfo.serviceDates[0]).Format('yyyy年MM月dd日'):'')"
              placeholder="请选择时间"
              unselectable="on"
              onfocus="this.blur()"
              @blur="restore"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <!-- <mt-cell title="服务天数">
        <my-inputnumber v-model="orderInfo.realNum" :min="1" :max="365"></my-inputnumber>
      </mt-cell>-->
      <mt-cell title="科室/病区">
        <slot name="right">
          <span @click="getLocs" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.locContent"
              placeholder="请选择科室"
              unselectable="on"
              onfocus="this.blur()"
              @blur="restore"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="床位">
        <slot name="right">
          <span @click="getBeds" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="orderInfo.bedContent"
              placeholder="请选择床位"
              unselectable="on"
              onfocus="this.blur()"
              @blur="restore"
            />
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
    </div>
    <!-- 被护理人信息 -->
    <div class="person-info" @click="selectPerson">
      <mt-cell class="selected" v-if="orderInfo.patientName" :title="orderInfo.patientName" is-link>
        <i slot="icon" v-if="orderInfo.isDefaultPatient" class="icon-default">常用</i>
      </mt-cell>
      <mt-cell class="new" v-else style="color:white" title="点击添加被护理人信息" is-link>
        <i slot="icon" class="myicon icon-add" style="color:white"></i>
      </mt-cell>
    </div>
    <!-- 联系人信息 -->
    <div class="linkMan">
      <mt-cell title="联系人">
        <slot name="right">
          <input
            v-model="orderInfo.linkMan"
            class="mint-field-core right"
            placeholder="请填写联系人姓名"
            maxlength="8"
            @focus="linkfocus"
            @input="validateName(orderInfo.linkMan)"
            @blur="restore"
          />
        </slot>
      </mt-cell>
      <mt-cell title="联系电话">
        <slot name="right">
          <input
            @focus="linkfocus"
            v-model="orderInfo.linkTelephone"
            class="mint-field-core right"
            placeholder="请填写联系人电话"
            @blur="restore"
          />
        </slot>
      </mt-cell>
    </div>
    <div class="hr-65"></div>
    <div class="bottom fixed">
      <mt-button type="primary" size="large" @click="confirm">下单</mt-button>
    </div>
    <!-- 服务开始时间弹窗 -->
    <!-- <my-actionsheet
      title="请选择开始时间"
      v-model="starttime.sheetVisible"
      :data="starttime.sheetList"
      @change="starttimeSelected"
    ></my-actionsheet>-->
    <selected-date
      title="请选择开始时间"
      pattern="order"
      :selectedmaxLimit="selectLimit"
      v-model="starttime.sheetVisible"
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
import { homeApi, orderApi, patientApi, mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'
import selectedDate from './popup/selectedDate'
export default {
  name: 'orderConfirm',
  data () {
    return {
      orderInfo: {
        type: 0,
        noEndTime: 0,
        serviceId: Number(this.$route.query.serviceId),
        serviceName: '',
        startTime: -1,
        realNum: 1,
        bedId: -1,
        kind: -1,
        bedContent: '',
        locId: -1,
        locContent: '',
        starttimeContent: '',
        patientCode: '',
        patientName: '',
        linkMan: '',
        linkTelephone: '',
        isDefaultPatient: 0,
        serviceDates: []
      },
      campusId: 0,
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
      },
      patientToList: true, // 有被护理人信息列表时，跳到列表页（不论是否有默认）
      selectLimit: 0
    }
  },
  components: { selectedDate },
  computed: {
    formTips () {
      // if (!this.orderInfo.starttimeContent) return '请选择开始时间'
      if (!this.orderInfo.locContent) return '请选择科室'
      if (!this.orderInfo.bedContent) return '请选择床位'
      if (!this.orderInfo.patientCode) return '请添加被护理人'
      if (!utils.validatePhoneAllowEmpty(this.orderInfo.linkTelephone)) {
        return '手机号码格式不正确'
      } else return false
    }
  },
  created () {
    if (!this.orderInfo.serviceId) {
      this.$MessageBox('参数异常，请重新再试！').then(() => {
        this.$router.go(-1)
      })
    }
    this.serviceDetailInIt(this.orderInfo.serviceId)
    // 全局由orderInfo，直接填入
    if (this.$store.state.orderInfo.serviceId === this.orderInfo.serviceId) {
      this.orderInfo = this.$store.state.orderInfo
    }
    // 清空原来的service
    this.$store.commit('setOrderInfo', {})
    // 如果全局存下来的orderInfo没有被护理人信息，调接口拿
    if (!this.orderInfo.patientCode || !this.orderInfo.patientName) {
      // 获取被护理人信息
      patientApi.patientList().then((data) => {
        // 选择isDefault的那条数据
        var patientDefault = (data.data.data.list || []).filter(
          (m) => m.isDefault
        )[0]
        if (patientDefault) {
          this.orderInfo.patientCode = patientDefault.code
          this.orderInfo.patientName = patientDefault.name
          this.orderInfo.isDefaultPatient = 1
        }
        // 如果没有被护理人，则需要跳到新增页
        if (!data.data.data) {
          this.patientToList = false
        }
      })
    }
  },
  methods: {
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
    },
    serviceDatesInit (val) {
      console.log('val', val)
      this.orderInfo.serviceDates = val
    },
    // 套餐详情
    restore () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        window.scroll(0, 0)
      }
    },
    serviceDetailInIt (id) {
      homeApi
        .serviceDetail(id)
        .then((json) => {
          this.orderInfo.serviceName = json.data.data.bigTitle
          this.orderInfo.kind = json.data.data.kind
          this.selectLimit = this.orderInfo.kind === 2 ? 1 : 0
          this.campusId = json.data.data.campusId
        })
        .catch((e) => {
          this.$MessageBox('套餐数据异常，请重新再试！').then(() => {
            this.$router.go(-1)
          })
        })
      mineApi.selfInfo().then((Response) => {
        this.orderInfo.linkTelephone = Response.data.data.telephone
      })
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
    // 选中的床位
    bedSelected (val) {
      this.orderInfo.bedId = this.bed.totalData.filter((m) => {
        return m.name === val[0]
      })[0].id
      this.orderInfo.bedContent = val[0]
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
    // 获取科室病区信息
    getLocs () {
      orderApi
        .getLocation(this.campusId)
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
    // 被护理人点击跳转
    selectPerson () {
      // 全局存储orderInfo。
      this.$store.commit('setOrderInfo', this.orderInfo)
      this.$router.push(this.patientToList ? '/user/list' : '/user/detail')
    },
    // 下单校验/下单确认
    confirm () {
      // 校验是否已经全部填写信息
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      orderApi
        .confirm(this.orderInfo)
        .then((data) => {
          if (data.data.data.id) {
            this.$router.replace('/order/detail?orderId=' + data.data.data.id)
          }
        })
        .catch((e) => {
          let msg = e.data.errmsg ? e.data.errmsg : '下单失败，请稍后再试！'
          this.$MessageBox.alert(msg)
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    validateName (name) {
      this.orderInfo.linkMan = utils.filterEmojiStrict(name)
    }
  }
}
</script>

<style lang="less">
input:disabled {
  background-color: @background-white;
}
.order-confirm {
  .person-info {
    background-color: #f2f2f2;
    margin: 15px;
    height: 52px;
    border-radius: 1px;
    box-shadow: 0px 4px 10px 0px rgba(71, 92, 123, 0.3);
    .new {
      background-color: @color-default;
    }
    .selected {
      background-color: @color-green;
    }
    .mint-cell-title {
      flex: initial;
      .icon-default {
        float: right;
        margin-left: 8px;
        text-align: center;
        width: 44px;
        height: 18px;
        line-height: 18px;
        border-radius: 1px;
        background-color: rgba(255, 255, 255, 0.25);
        color: #ffffff;
        font-size: 12px;
      }
      .mint-cell-text {
        float: right;
        line-height: 20px;
      }
    }
    .mint-cell-allow-right,
    .mint-cell-text {
      color: #ffffff;
    }
  }
  .linkMan {
    padding-bottom: 72px;
  }
}
</style>
