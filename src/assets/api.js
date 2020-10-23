import axios from 'axios'
// 分组定义api，便于管理
const basicApi = { }
const myApi = {
  getInspectRecords: (serviceId) => {
    return axios.get('/orderInspection/getRecords', {
      params: {
        serviceId: serviceId
      }
    })
  },
  addRecord: (params) => {
    return axios.post('/orderInspection/addRecord', params)
  }
}
const wxApi = { }
export {
  basicApi,
  myApi,
  wxApi
}
