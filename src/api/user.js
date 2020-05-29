import request from '@/utils/request'

export function getUserList(param) {
  return request({
    url: '/api/user/getUserList',
    method: 'post',
    data: param
  })
}

export function getUserAccountList(param) {
  return request({
    url: '/api/user/getUserAccountList',
    method: 'post',
    data: param
  })
}

export function getNoticeList(param) {
  return request({
    url: '/api/notice/getNoticeList',
    method: 'post',
    data: param
  })
}

export function createUserAccount(param) {
  return request({
    url: '/api/user/createUserAccount',
    method: 'post',
    data: param
  })
}

export function updateUserAccount(param) {
  return request({
    url: '/api/user/updateUserAccount',
    method: 'post',
    data: param
  })
}

export function updateUserPassword(param) {
  return request({
    url: '/api/user/updateUserPassword',
    method: 'post',
    data: param
  })
}

export function updateOwnUserPassword(param) {
  return request({
    url: '/api/user/updateOwnUserPassword',
    method: 'post',
    data: param
  })
}

export function getUnreadNoticeData(param) {
  return request({
    url: '/api/notice/getUnreadNoticeData',
    method: 'post',
    data: param
  })
}

export function readNotice(param) {
  return request({
    url: '/api/notice/readNotice',
    method: 'post',
    data: param
  })
}
export function updateOwnUserAccount(param) {
  return request({
    url: '/api/user/updateOwnUserAccount',
    method: 'post',
    data: param
  })
}

