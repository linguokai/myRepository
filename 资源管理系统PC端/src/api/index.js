import req from '../fetch/index.js'

const config = {
  getTotalDigit: {
    url: 'manage/totalDigital'
  },
  getOperation: {
    url: 'manage/getOperation',
    method: 'post'
  },
  addOperation: {
    url: 'manage/operation',
    method: 'post'
  },
  delOperation: {
    url: 'manage/delOperation',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
