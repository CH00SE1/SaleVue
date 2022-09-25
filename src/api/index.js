import request, { postRequest } from '../utils/request'

// 查询当天销售列表
export function listDaySale (query) {
  if (query === null) {
    return request({
      methed: 'get',
      url: '/sales/shop/' + 'day' + '/32'
    })
  }
  return request({
    methed: 'get',
    url: '/sales/shop/' + query + '/32'
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

// 导出excel数据
export function exportListExcel (dateTime, shopId) {
  return postRequest({
    method: 'post',
    url: '/sales/excel/' + dateTime + '/' + shopId,
    responseType: 'blob'
  })
}

// 查询分类毛利
export function queryFlNameDay (dateTime, shopId) {
  return postRequest({
    method: 'post',
    url: '/sales/fl_money',
    params: {
      dateTime: dateTime,
      shopId: shopId
    }
  })
}

// 删除请求网卡
export function deleteReqMac (data) {
  return postRequest({
    method: 'post',
    url: '/npMacReq/req_mac_delete',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

// 查询hsInfo平台分类
export function queryPlatform () {
  return request({
    method: 'get',
    url: '/hsInfo/platform'
  })
}

// 查询挂单
export function pendingOrder (query) {
  return request({
    method: 'get',
    url: '/sales/pendingOrder',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: query
  })
}

// 查询门店信息
export function shopInfoAll () {
  return request({
    method: 'get',
    url: '/sales/shopInfoAll'
  })
}
