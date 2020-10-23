import axios from 'axios'
import qs from 'qs'

// 订单api
const orderApi = {
  // 线上缴存配置项
  getOpenDeposit: () => {
    return axios.get('/config/getOpenDeposit')
  },
  // 支付成功回调
  payCallback: orderId => {
    return axios.post('/order/frontPayCallback', {
      id: orderId
    })
  },
  // 支付成功回调
  endOrder: (orderId, whetherChangePrice) => {
    return axios.put('/order/endOrder', qs.stringify({
      orderId, whetherChangePrice
    }))
  },
  // 延迟支付
  payDelay: id => {
    return axios.put('/order/payDelay', qs.stringify({
      id
    }))
  },
  // 用户确认订单
  confirmOrder: id => {
    return axios.put('/order/confirmOrder', qs.stringify({
      id
    }))
  },
  messageError: id => {
    return axios.put('/order/messageError', qs.stringify({
      id
    }))
  },
  // 申请线下付款
  offlinePay: orderId => {
    return axios.post('/order/offlinePaymentApply', {
      id: orderId
    })
  },
  // 获取空间科室（病区） // 空间表
  getLocation: campusId => {
    return axios.get('/order/districts', {
      params: {
        campusId: campusId, // 传院区
        pageSize: 0,
        pageNo: 1
      }
    })
  },
  // 获取床位信息 // 床位表
  getOrderBed: districtId => {
    return axios.get('/order/beds', {
      params: {
        districtId: districtId, // 空间科室（病区）
        pageSize: 0,
        pageNo: 1
      }
    })
  },
  // 提交订单
  confirm: arg => {
    return axios.post('/order', arg)
  },
  associateOrderQR: orderId => {
    return axios.get('/order/associateOrderQR', {
      params: { orderId: orderId }
    })
  },
  // 申请改价
  changeApply: arg => {
    return axios.post('/orderPriceRevision/priceChangeApply', arg)
  },
  // 批准/拒绝改价申请
  wxPriceChangeApprove: (orderId, boolean) => {
    return axios.post('/orderPriceRevision/wxPriceChangeApprove',
      {
        id: orderId,
        approveStatus: boolean
      }
    )
  },
  // 去支付
  pay: arg => {
    return axios.post('/order/pay', arg)
  },
  // 订单列表
  getOrderList: (status, pageSize, pageNo, searchParam) => {
    return axios.get('/order/orders', {
      params: {
        status,
        pageSize,
        pageNo,
        searchParam
      }
    })
  },
  // 订单详情
  getOrderDetail: id => {
    return axios.get('/order', {
      params: {
        id
      }
    })
  },
  // 订单取消
  cancelOrder: id => {
    return axios.put('/order/cancel', qs.stringify({
      id
    }))
  },
  // 订单修改
  updateOrder: arg => {
    return axios.post('/order/update', arg)
  },
  // 订单申请退款
  refund: careOrderRefund => {
    return axios.post('/order/refund', careOrderRefund)
  },
  // 订单批准/拒绝退款申请
  refundApprove: (orderId, boolean, fileName) => {
    return axios.put('/order/refundApprove',
      qs.stringify({
        id: orderId,
        approve: boolean,
        fileNames: fileName
      })
    )
  },
  // 订单去评价
  evaluate: (orderId, stars, text, labels) => {
    return axios.post('/sugeval/evaluate', {
      orderId: orderId,
      evaluate1: stars,
      evaluate: text,
      labelIds: labels
    })
  },
  // 订单获取标签
  evaluateTip: arg => {
    return axios.get('sugeval/evaluateLabels')
  },
  // 呼叫护工
  callOut: (pageSize, pageNo) => {
    return axios.get('/order/callOut', {
      params: {
        pageSize: pageSize,
        pageNo: pageNo
      }
    })
  }
}
// 个人api
const mineApi = {
  // 登录
  login: (tenantId, token, code, role) => {
    return axios.post('/login', {
      tenantId: tenantId,
      token: token,
      code: code,
      role: role
    })
  },
  // 推送登录
  hlmsPushLogin: (tenantId, loginName, selectedCampusId) => {
    return axios.post('/login/hlmsPushLogin', {
      tenantId: tenantId,
      loginName: loginName,
      selectedCampusId: selectedCampusId
    })
  },
  // 登出
  logout: arg => {
    return axios.get('/login/logout')
  },
  // 项目经理及运维管家查询其负责的所有院区
  workCampusList: arg => {
    return axios.get('/product/workCampusList')
  },
  // 项目经理及运维管家设置选择的院区
  updateSelectedCampus: campusId => {
    return axios.get('/product/updateSelectedCampus', {
      params: {
        campusId: campusId
      }
    })
  },
  // 获取手机随机验证码
  getRandomCode: (telephone) => {
    return axios.get('/login/randomCode', {
      params: {
        telephone: telephone
      }
    })
  },
  telephone: arg => {
    return axios.post('/login/telephone', arg)
  },
  // 切换角色 已弃用
  switchRole: (role) => {
    return axios.get('/login/role', {
      params: {
        role: role
      }
    })
  },
  // 获取个人信息
  selfInfo: arg => {
    return axios.get('/user/selfInfo')
  },
  // 上传文件
  upload: (File, config) => {
    return axios.post('/file/uploadImg', File, config)
  },
  // 提交建议与反馈
  suggest: data => {
    return axios.post('/sugeval/suggest', data)
  },
  // 回复建议与反馈
  reply: (id, replyNote) => {
    return axios.post('/sugeval/suggestReply', {
      id: id,
      replyNote: replyNote
    })
  },
  // 获取建议与反馈列表
  getSuggestList: (pageSize, pageNo, orderId) => {
    return axios.get('/sugeval/suggests', {
      params: {
        pageSize,
        pageNo,
        orderId
      }
    })
  },
  // 获取满意度评价
  getEvaluate: (evaluateDate) => {
    return axios.get('/sugeval/staffEvaluate', {
      params: {
        evaluateDate: evaluateDate
      }
    })
  },
  // 护士长/运维管家提交评价
  postEvaluate: arg => {
    return axios.post('/sugeval/staffEvaluate', arg)
  },
  // 获取最新的建议与反馈
  getRecentSuggest: (orderId) => {
    return axios.get('/sugeval/recentSuggest', {
      params: {
        orderId: orderId
      }
    })
  },
  // 获取每日简报
  getDailyReport: (reportDate) => {
    return axios.get('/statistics/briefReport', {
      params: {
        reportDate: reportDate
      }
    })
  }

}

// 产品api
const homeApi = {
  // 获取护工团队列表
  teamOrderWorkers: (orderId, pageSize, pageNo) => {
    return axios.get('/user/teamOrderWorkers', {
      params: {
        orderId: orderId,
        pageSize: pageSize,
        pageNo: pageNo
      }
    })
  },
  // 首页根据经纬度获取最近的院区;
  getTenant: (longitude, latitude) => {
    return axios.get('/product/campus', {
      params: {
        longitude: longitude,
        latitude: latitude
      }
    })
  },
  // 获取某城市下所有院区列表
  getTenantList: (city) => {
    return axios.get('/product/campusList', {
      params: {
        city: city,
        pageNo: 1,
        pageSize: 0
      }
    })
  },
  // 获取所有有租户的城市列表
  getCityList: () => {
    return axios.get('/product/cities', {
      params: {
        pageNo: 1,
        pageSize: 0
      }
    })
  },
  // 根据指定院区获取产品服务
  // 产品服务表 hlms_care_service
  // 产品价格表 hlms_care_price
  serviceList: (campusId, pageNo, pageSize) => {
    return axios.get('/product/services', {
      params: {
        campusId: campusId,
        pageSize: pageSize,
        pageNo: pageNo
      }
    })
  },
  // 护工列表 + 获取金牌团队信息
  // 多园区修改, tentantId 改为 campusId
  teamWorkerList: (campusId, pageNo, pageSize, rank, districtId, orderId) => {
    return axios.get('/user/teamWorkers', {
      params: {
        campusId: campusId,
        pageSize: pageSize,
        pageNo: pageNo,
        rank: rank,
        districtId: districtId,
        orderId: orderId
      }
    })
  },
  // 护工简介
  teamWorkerDetail: userCode => {
    return axios.get('/user/teamWorker', {
      params: {
        userCode: userCode // 传护工code
      }
    })
  },
  // 套餐详情 （ 含历史订单数量）
  serviceDetail: serviceId => {
    return axios.get('/product/service', {
      params: {
        serviceId
      }
    })
  },
  // 套餐详情查评价
  evaluateList: (serviceId, pageSize, pageNo) => {
    return axios.get('/sugeval/evaluations', {
      params: {
        serviceId,
        pageSize,
        pageNo
      }
    })
  }
}

// 被护理人api
const patientApi = {
  // 被护理人列表
  patientList: () => {
    return axios.get('/user/patients', {
      params: {
        pageSize: 0,
        pageNo: 1
      }
    })
  },
  // 查询 被护理人信息
  patientDetail: code => {
    return axios.get('/user/patient', {
      params: {
        patientCode: code // 被护理人code
      }
    })
  },
  // 新增 被护理人信息
  patientAdd: arg => {
    return axios.post('/user/patient', arg)
  },
  // 修改 被护理人信息
  patientUpdate: arg => {
    return axios.put('/user/patient', arg)
  },
  // 查询被护理人身高体重param/list
  patientHM: kind => {
    return axios.get('/user/params', {
      params: {
        kind: kind // 身高、体重kind
      }
    })
  },
  // 删除被护理人
  patientDelete: code => {
    return axios.delete('/user/patient', {
      params: {
        patientCode: code // 被护理人code
      }
    })
  }
}
// 工单api
const workOrderApi = {
  // 服务详情，上传照片相关

  // 上传之后添加图片
  addPhoto: (paramsStr) => {
    // 参数拼接在地址栏
    const url = '/orderNote/addPhoto' + paramsStr
    return axios.put(url)
  },
  // 删除图片
  deletePhoto: (paramsStr) => {
    const url = '/orderNote/deletePhoto' + paramsStr
    return axios.put(url)
  },

  // 获取常用语列表
  getAllCampusDispatch: () => {
    return axios.get('/config/getAllCampusDispatch')
  },
  // 获取常用语列表
  getCommonLanguage: (data) => {
    return axios.get('/common/language/list', {
      params: data
    })
  },
  // 获取服务标准列表
  getServiceStandard: (data) => {
    return axios.get('/product/standards', {
      params: data
    })
  },
  // 绑定腕带
  wristBandBind: data => {
    return axios.post('/order/wristBandBind', data)
  },
  // 主管扫码，根据A4纸上的订单码获取当天的服务单id，然后跳转到服务详情
  getCareOrderNoteId: (code) => {
    return axios.get('/orderNote/careOrderNoteId', {
      params: {
        code: code
      }
    })
  },
  // 工单管理列表
  getWorkOrders: (pageSize, pageNo, status) => {
    return axios.get('/order/workOrders', {
      params: {
        pageSize: pageSize,
        pageNo: pageNo,
        status: status || 0
      }
    })
  },
  // 获取预约服务
  getCall: (id) => {
    return axios.get('/order/call', {
      params: {
        id: id
      }
    })
  },
  // 工单详情
  getWorkOrder: (orderId) => {
    return axios.get('/order/workOrder', {
      params: {
        orderId: orderId
      }
    })
  },
  // 工单服务列表
  getWorkServices: data => {
    return axios.post('/orderNote/workServices', data)
  },
  // 工单服务详情
  getWorkService: id => {
    return axios.get('/orderNote/workService', {
      params: {
        id: id
      }
    })
  },
  // 添加服务备注
  workServiceNote: (id, note) => {
    return axios.put('/orderNote/workServiceNote', {
      id: id,
      note: note
    })
  },
  // 添加服务评价 1/2/3/4
  workServiceEvaluate: (id, userSatisfaction) => {
    return axios.put('/orderNote/evaluate', {
      id: id,
      userSatisfaction: userSatisfaction
    })
  },
  // 分配护工
  sendCareWorkers: (orderId, workerCodes) => {
    return axios.post('/order/distribute', {
      id: orderId,
      workerCodes: workerCodes
    })
  },
  // 护工抢单
  callConfirm: (id) => {
    return axios.post('/order/callServiceConfirm', {
      id: id
    })
  },
  // 根据订单id、时间获取护理日志
  getOrderLogs: (orderId, datetime) => {
    return axios.get('/orderNote/dateWorkService', {
      params: {
        orderId: orderId,
        datetime: datetime
      }
    })
  },
  // 服务确认信息
  getCareOrderNote: id => {
    return axios.get('/orderNote/careOrderNote', {
      params: {
        orderServiceItemId: id
      }
    })
  },
  // 获取护工工作日志
  getWorkerLogs: orderServiceLogId => {
    return axios.get('/orderNote/workerLogs', {
      params: {
        orderServiceLogId: orderServiceLogId
      }
    })
  },
  // 新增护工工作日志
  sendWorkerLog: data => {
    return axios.post('/orderNote/workerLog', data)
  },
  // 获取服务列表 - 筛选 - 病区
  getWorkServiceDistricts: () => {
    return axios.get('/orderNote/getWorkServiceDistricts')
  },
  // 获取服务列表 - 筛选 - 护工
  getWorkServiceWorkers: () => {
    return axios.get('/orderNote/getWorkServiceWorkers')
  },

  // 获取当前所有的巡查记录列表，需要serviceId 15790
  getInspectRecords: (serviceId) => {
    return axios.get('/orderInspection/getRecords', {
      params: {
        serviceId: serviceId
      }
    })
  },
  // 获取单条巡查记录详情，需要 当前记录的id
  getRecordById: (id) => {
    return axios.get('/orderInspection/getRecordById', {
      params: {
        id: id
      }
    })
  },
  // 新建巡查记录表单
  getInspectForm: () => {
    return axios.get('/orderInspection/getForm')
  },
  // 提交巡查科室的记录结果
  addRecord: (params) => {
    return axios.post('/orderInspection/addRecord', params)
  }

}

// 数据统计API
const dashBoardApi = {
  // 数据总览
  // http://127.0.0.1:8090/api/v1/dashboard/overview
  // ?beginDate=2020-09&endDate=2020-09&dimension=1
  getOverview: (data) => {
    return axios.get('/dashboard/overview', {
      params: data
    })
  },
  // 科室订单数量 - 获取按时间选择范围的所有科室的订单数量
  // 入参：beginDate=2020-05-01&endDate=2020-09-31
  districtsCareOrderNum: (data) => {
    return axios.get('/dashboard/districtsCareOrderNum', {
      params: data
    })
  },
  datesCareOrderNum: (data) => {
    return axios.get('/dashboard/datesCareOrderNum', {
      params: data
    })
  },
  districtRevenueProportion: (data) => {
    return axios.get('/dashboard/districtRevenueProportion', {
      params: data
    })
  },
  // 上工次数
  workingTimes: (data) => {
    return axios.get('/dashboard/workingTimes', {
      params: data
    })
  }
}

const wxApi = {
  // 获取微信的接口获取微信JSSDK签名
  getSign: (url) => {
    return axios.post('/common/getWxSign', {
      url: url || window.location.href.split('#')[0]
    })
    // window.location.href.split('#')[0] encodeURIComponent(1window.localStorage.getItem('locationUrl'))
  }
}
export {
  orderApi,
  mineApi,
  homeApi,
  patientApi,
  workOrderApi,
  wxApi,
  dashBoardApi
}
