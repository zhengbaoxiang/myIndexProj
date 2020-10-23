import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 注册页面修改手机号时的缓存
    ruleForm: {
      tel: '',
      randomCode: ''
    },
    // 标志多院区派单的配置项
    allCampusDispatch: null,
    // 标志线上缴存的配置项
    depositDispatch: null,
    // 当缓存页面需要刷新时修改为true
    refreshNextPage: false,
    // 当缓存页面需要刷新时修改为true
    refreshNext: {
      careworkerList: false,
      serviceList: false,
      serviceTrack: false,
      manageList: false,
      orderList: false,
      serviceSelect: false
    },
    // 当按钮点击防按钮重复提交
    submit: true,
    // route.js中通过该参数判断是否main.js初始化完毕是否放行
    initing: false,
    // 在用户首页进行判断是否走完整的获取租户流程
    tenantConfirmed: false,
    token_worker: null,
    token_user: null,
    hasService: false,
    breadcrumbs: [],
    bindInfo: {
      orderCode: null,
      hardwareQrCode: null,
      status: 0 // 0为正常 1为异常
    },
    // 存储下单时，被护理人之间的交互信息。
    orderInfo: {},
    selectedInfo: {
      selected: null,
      carerSearchText: null
    },
    noteMap: new Map()
  },
  mutations: {
    setBreadcrumbs (state, info) {
      state.breadcrumbs = info || []
    },
    setIniting (state, initing) {
      state.initing = initing
    },
    setTenantConfirmed (state, flag) {
      state.tenantConfirmed = flag
    },
    setOrderNote (state, orderId, note) {
      state.noteMap.set(orderId, note)
    },
    // 设置绑铃状态
    setBindInfo (state, bindInfo) {
      state.bindInfo.orderCode = bindInfo.orderCode
      state.bindInfo.hardwareQrCode = bindInfo.hardwareQrCode
    },
    setBindStatus (state, status) {
      state.bindInfo.status = status
    },
    setBindInit (state) {
      state.bindInfo.orderCode = null
      state.bindInfo.hardwareQrCode = null
      state.bindInfo.status = 0
    },
    // 设置按钮是否可重复点击
    setSubmit (state, submit) {
      state.submit = submit
    },
    setOrderInfo (state, info) {
      state.orderInfo = info || {}
    },
    setSelectedInfo (state, selectedInfo) {
      state.selectedInfo = selectedInfo || {
        selected: null,
        carerSearchText: null
      }
    },
    setRuleForm (state, ruleForm) {
      state.ruleForm = ruleForm
    },
    setHasService (state, hasService) {
      state.hasService = hasService
    }
  }
})
