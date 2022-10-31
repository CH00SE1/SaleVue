// 添加日期范围
export function addDateRange (params, dateRange, propName) {
  var search = params
  search.params = {}
  if (dateRange !== null && dateRange !== '') {
    if (typeof (propName) === 'undefined') {
      search.params['beginTime'] = dateRange[0]
      search.params['endTime'] = dateRange[1]
    } else {
      search.params['begin' + propName] = dateRange[0]
      search.params['end' + propName] = dateRange[1]
    }
  }
  return search
}
