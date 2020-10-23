import axios from 'axios'
// 被护理人api
const patientApi = { }
// 工单api
const workOrderApi = {
  // 获取当前所有的巡查记录列表，需要serviceId 15790
  getInspectRecords: (serviceId) => {
    return axios.get('/orderInspection/getRecords', {
      params: {
        serviceId: serviceId
      }
    })
  },
  // 提交巡查科室的记录结果
  addRecord: (params) => {
    return axios.post('/orderInspection/addRecord', params)
  }
}
const wxApi = { }
export {
  patientApi,
  workOrderApi,
  wxApi
}
