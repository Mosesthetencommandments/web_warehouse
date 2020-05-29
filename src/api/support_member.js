import request from '@/utils/request'

export function getSupportMemberList(param) {
  return request({
    url: '/api/support/getSupportMemberList',
    method: 'post',
    data: param
  })
}
export function getSupportGroupList(param) {
  return request({
    url: '/api/sales/getSupportGroupList',
    method: 'post',
    data: param
  })
}
export function updateSupportProduct(param) {
  return request({
    url: '/api/support/updateSupportProduct',
    method: 'post',
    data: param
  })
}

export function editSupportInfo(param) {
  return request({
    url: '/api/support/editSupportInfo',
    method: 'post',
    data: param
  })
}

export function updateSupportTransModelTime(param) {
  return request({
    url: '/api/support/updateSupportTransModelTime',
    method: 'post',
    data: param
  })
}
export function getSupportTransModelTimeList(param) {
  return request({
    url: '/api/support/getSupportTransModelTimeList',
    method: 'post',
    data: param
  })
}
export function createSupportTransModelTime(param) {
  return request({
    url: '/api/support/createSupportTransModelTime',
    method: 'post',
    data: param
  })
}
export function deleteSupportTransModelTime(param) {
  return request({
    url: '/api/support/deleteSupportTransModelTime',
    method: 'post',
    data: param
  })
}
