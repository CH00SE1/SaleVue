import request, { postRequest } from '../utils/request'

// 查询当天销售列表
export function listDaySale () {
  return request({
    methed: 'get',
    url: '/sales/shop/day/32'
  })
}

// 查询昨天天销售列表
export function listYesterdaySale () {
  return request({
    methed: 'get',
    url: '/sales/shop/yesterday/32'
  })
}

// 查询当月销售列表
export function listMonthSale () {
  return request({
    methed: 'get',
    url: '/sales/shop/month/32'
  })
}

// 查询上月销售列表
export function listLastMonthSale () {
  return request({
    methed: 'get',
    url: '/sales/shop/lastmonth/32'
  })
}

// 查询当年销售列表
export function listYearSale () {
  return request({
    methed: 'get',
    url: '/sales/shop/year/32'
  })
}

// 查询hsInfo数据列表
export function listHsInfo (query) {
  return request({
    methed: 'get',
    url: '/hsInfo/list',
    params: query
  })
}

// m3u8视频下载
export function DownloadVideo (data) {
  return postRequest({
    method: 'post',
    url: '/hsInfo/download',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

// 获取mac列表
export function macList (query) {
  return request({
    method: 'get',
    url: '/npMacReq/list',
    params: query
  })
}

// 审核网卡
export function auditMac (data) {
  return postRequest({
    method: 'post',
    url: '/npMacReq/auditMac',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

// 获取使用mac列表
export function useMacList (query) {
  return request({
    method: 'get',
    url: '/npMacReq/user_list',
    params: query
  })
}

// 删除网卡
export function deleteMac (data) {
  return postRequest({
    method: 'post',
    url: '/npMacReq/user_delete_mac',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

// 查询当天个人销售明细
export function listNameDaySale (query) {
  return postRequest({
    method: 'post',
    url: '/sales/dtl',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: query
  })
}
