import req from '../fetch/index.js'

const config = {
  searchResource: {
    url: 'manage/searchResource',
    method: 'post'
  },
  verification: {
    url: 'manage/verification',
    method: 'get'
  },
  delResource: {
    url: 'manage/delResource',
    method: 'get'
  },
  addOperation: {
    url: 'manage/operation',
    method: 'post'
  },
  getSort: {
    url: 'sort/sort'
  },
  addResource: {
    url: 'manage/addResource',
    method: 'post'
  },
  operation: {
    url: 'manage/operation',
    method: 'post'
  },
  downloadDigital: {
    url: 'manage/downloadDigital',
    method: 'get'
  }
}
const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
