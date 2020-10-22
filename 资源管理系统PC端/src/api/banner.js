import req from '../fetch/index.js'

const config = {
  addBanner: {
    url: 'manage/addBanner'
  },
  bannerLst: {
    url: 'manage/bannerLst'
  },
  delBanner: {
    url: 'manage/delBanner'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
