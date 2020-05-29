import request from '@/utils/request'

export function getWarehouseStatisticsData(param) {
  return request({
    url: '/api/overview/getWarehouseStatisticsData',
    method: 'post',
    data: param
  })
}

export function getWarehouseMonthlyData(param) {
  return request({
    url: '/api/overview/getWarehouseMonthlyData',
    method: 'post',
    data: param
  })
}

export function getWeixinFansRecordData(param) {
  return request({
    url: '/api/overview/getWeixinFansRecordData',
    method: 'post',
    data: param
  })
}

export function getWeixinRecordUnfilledList(param) {
  return request({
    url: '/api/overview/getWeixinRecordUnfilledList',
    method: 'post',
    data: param
  })
}
