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
  },
  getPics: (params) => {
    // const initialurl = 'https://uploadfile.bizhizu.cn/2015/0122/20150122034455582.jpg'
    const url = '/proxy/2015/0122/20150122034455582.jpg'
    return axios.get(url, {
      params: params
    })
  }
}
const wxApi = { }
export {
  basicApi,
  myApi,
  wxApi
}
