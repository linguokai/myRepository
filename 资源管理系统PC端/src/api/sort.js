import req from '../fetch/index.js'

const config = {
  addOperation: {
    url: 'manage/operation',
    method: 'post'
  },
  getSort: {
    url: 'sort/sort'
  },
  addSort: {
    url: 'manage/addSort',
    method: 'post'
  },
  updateSort: {
    url: 'manage/updateSort',
    method: 'post'
  },
  delSort: {
    url: 'manage/delSort',
    method: 'get'
  }
}
const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
