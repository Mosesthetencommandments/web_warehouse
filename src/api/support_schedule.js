import request from '@/utils/request'

export function getSupportMemberSchedule(param) {
  return request({
    url: '/api/support/getSupportMemberSchedule',
    method: 'post',
    data: param
  })
}

export function updateSupportMemberSchedule(param) {
  return request({
    url: '/api/support/updateSupportMemberSchedule',
    method: 'post',
    data: param
  })
}
