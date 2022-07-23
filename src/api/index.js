import request from '../utils/request'

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
