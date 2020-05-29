import request from '@/utils/request'

export function getLogsList(param) {
  return request({
    url: '/api/system/getLogsList',
    method: 'post',
    data: param
  })
}
export function getSystemActivityList(param) {
  return request({
    url: '/api/system/getSystemActivityList',
    method: 'post',
    data: param
  })
}
export function createSystemActivity(param) {
  return request({
    url: '/api/system/createSystemActivity',
    method: 'post',
    data: param
  })
}
export function updateSystemActivity(param) {
  return request({
    url: '/api/system/updateSystemActivity',
    method: 'post',
    data: param
  })
}
export function deleteSystemActivity(param) {
  return request({
    url: '/api/system/deleteSystemActivity',
    method: 'post',
    data: param
  })
}

