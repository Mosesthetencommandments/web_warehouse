import request from '@/utils/request'

export function getUserAccountRoleList(param) {
  return request({
    url: '/api/user/getUserAccountRoleList',
    method: 'post',
    data: param
  })
}

export function getUserAccountTypeList(param) {
  return request({
    url: '/api/user/getUserAccountTypeList',
    method: 'post',
    data: param
  })
}

export function createUserAccountRole(param) {
  return request({
    url: '/api/user/createUserAccountRole',
    method: 'post',
    data: param
  })
}

export function updateUserAccountRole(param) {
  return request({
    url: '/api/user/updateUserAccountRole',
    method: 'post',
    data: param
  })
}

export function deleteUserAccountRole(param) {
  return request({
    url: '/api/user/deleteUserAccountRole',
    method: 'post',
    data: param
  })
}
