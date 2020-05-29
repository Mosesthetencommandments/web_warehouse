import request from '@/utils/request'
export function getUserMenu(param) {
  return request({
    url: 'api/user/getUserMenu',
    method: 'post',
    data: param
  })
}
export function createUserMenu(param) {
  return request({
    url: 'api/user/createUserMenu ',
    method: 'post',
    data: param
  })
}
export function updateUserMenu(param) {
  return request({
    url: 'api/user/updateUserMenu ',
    method: 'post',
    data: param
  })
}
export function deleteUserMenu(param) {
  return request({
    url: 'api/user/deleteUserMenu ',
    method: 'post',
    data: param
  })
}
export function getUserAccountRoleAuthList(param) {
  return request({
    url: '/api/user/getUserAccountRoleAuthList',
    method: 'post',
    data: param
  })
}
export function editUserAccountRolePermission(param) {
  return request({
    url: '/api/user/editUserAccountRolePermission',
    method: 'post',
    data: param
  })
}
export function getUserAccountAuthList(param) {
  return request({
    url: '/api/user/getUserAccountAuthList',
    method: 'post',
    data: param
  })
}
export function editExtraAuth(param) {
  return request({
    url: '/api/user/editExtraAuth',
    method: 'post',
    data: param
  })
}
export function updateAuth(param) {
  return request({
    url: 'api/user/updateAuth  ',
    method: 'post',
    data: param
  })
}
export function deleteAuth(param) {
  return request({
    url: 'api/user/deleteAuth  ',
    method: 'post',
    data: param
  })
}
export function createAuth(param) {
  return request({
    url: 'api/user/createAuth ',
    method: 'post',
    data: param
  })
}

export function getAllAuthList(param) {
  return request({
    url: 'api/user/getAllAuthList ',
    method: 'post',
    data: param
  })
}

export function editUserMenuAuthRelation(param) {
  return request({
    url: 'api/user/editUserMenuAuthRelation',
    method: 'post',
    data: param
  })
}

export function getUserAccountMenuAuthRelationList(param) {
  return request({
    url: 'api/user/getUserAccountMenuAuthRelationList',
    method: 'post',
    data: param
  })
}

export function getUserAccountRoleMenuAuthRelationList(param) {
  return request({
    url: 'api/user/getUserAccountRoleMenuAuthRelationList',
    method: 'post',
    data: param
  })
}

export function getMenuAuthList(param) {
  return request({
    url: 'api/user/getMenuAuthList ',
    method: 'post',
    data: param
  })
}

export function editAccountAuth(param) {
  return request({
    url: 'api/user/editAccountAuth ',
    method: 'post',
    data: param
  })
}

export function getPermissionList(param) {
  return request({
    url: 'api/user/getPermissionList',
    method: 'post',
    data: param
  })
}

export function createUserPermission(param) {
  return request({
    url: 'api/user/createUserPermission',
    method: 'post',
    data: param
  })
}

export function updateUserPermission(param) {
  return request({
    url: 'api/user/updateUserPermission ',
    method: 'post',
    data: param
  })
}

export function deleteUserPermission(param) {
  return request({
    url: 'api/user/deleteUserPermission ',
    method: 'post',
    data: param
  })
}

export function editUserPermissionAuth(param) {
  return request({
    url: 'api/user/editUserPermissionAuth ',
    method: 'post',
    data: param
  })
}

export function getPermissionByMenu(param) {
  return request({
    url: 'api/user/getPermissionByMenu ',
    method: 'post',
    data: param
  })
}

export function getAccountRolePermission(param) {
  return request({
    url: 'api/user/getAccountRolePermission ',
    method: 'post',
    data: param
  })
}

export function getAccountPermission(param) {
  return request({
    url: 'api/user/getAccountPermission ',
    method: 'post',
    data: param
  })
}

export function editAccountPermission(param) {
  return request({
    url: 'api/user/editAccountPermission ',
    method: 'post',
    data: param
  })
}

export function editUserAccountPermission(param) {
  return request({
    url: 'api/user/editUserAccountPermission ',
    method: 'post',
    data: param
  })
}
