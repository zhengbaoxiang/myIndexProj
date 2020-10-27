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
    const url = '/proxyName/2015/0122/20150122034455582.jpg'
    return axios.get(url, {
      params: params
    })
  },
  // 获取新闻列表
  getNews: (type) => {
    // const initialurl = 'http://v.juhe.cn/toutiao/index'
    const url = '/v/toutiao/index' // 使用跨域代理 /juhe
    return axios.get(url, {
      params: {
        type: type,
        key: '7fae858891a1ecceec1a1d14dc3e0671'
      }
    })
  },
  // 获取总的图书目录
  getBookCatalog: () => {
    // const initialurl = 'http://apis.juhe.cn/goodbook/catalog'
    const url = '/apis/goodbook/catalog' // 使用跨域代理
    return axios.get(url, {
      params: {
        dtype: 'json',
        key: 'e9b14715801194db2573a8bf49a78140'
      }
    })
  }
}
const wxApi = { }
export {
  basicApi,
  myApi,
  wxApi
}
