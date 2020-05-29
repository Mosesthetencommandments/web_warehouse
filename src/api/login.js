import request from '@/utils/request'

export function login(phone, password) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: {
      phone,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/getUserAccountInfo',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function getUserPermissionMenu(param) {
  return request({
    url: '/api/user/getUserPermissionMenu',
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
export function loginAccount(param) {
  return request({
    url: '/api/user/loginAccount',
    method: 'post',
    data: param
  })
}
