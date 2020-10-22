import req from '../fetch/index.js'

const config = {
  getOnlineUser: {
    url: 'manage/getOnlineUser'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
