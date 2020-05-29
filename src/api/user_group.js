import request from '@/utils/request'

export function getUserAccountGroupList(param) {
  return request({
    url: '/api/user/getUserAccountGroupList',
    method: 'post',
    data: param
  })
}

export function getUserAccountGroupTree(param) {
  return request({
    url: '/api/user/getUserAccountGroupTree',
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

export function createUserAccountGroup(param) {
  return request({
    url: '/api/user/createUserAccountGroup',
    method: 'post',
    data: param
  })
}

export function updateUserAccountGroup(param) {
  return request({
    url: '/api/user/updateUserAccountGroup',
    method: 'post',
    data: param
  })
}

export function deleteUserAccountGroup(param) {
  return request({
    url: '/api/user/deleteUserAccountGroup',
    method: 'post',
    data: param
  })
}
