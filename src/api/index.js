import request from '../utils/request'

// 查询当天销售列表
export function listDaySale () {
  return request({
    methed: 'get',
    url: '/day/32'
  })
}

// 查询昨天天销售列表
export function listYesterdaySale () {
  return request({
    methed: 'get',
    url: '/yesterday/32'
  })
}

// 查询当月销售列表
export function listMonthSale () {
  return request({
    methed: 'get',
    url: '/month/32'
  })
}

// 查询上月销售列表
export function listLastMonthSale () {
  return request({
    methed: 'get',
    url: '/lastmonth/32'
  })
}

// 查询当年销售列表
export function listYearSale () {
  return request({
    methed: 'get',
    url: '/year/32'
  })
}
