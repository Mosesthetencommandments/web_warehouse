import request from '@/utils/request'

export function getUserAccountGroupTeamList(param) {
  return request({
    url: '/api/user/getUserAccountGroupTeamList',
    method: 'post',
    data: param
  })
}

export function createUserAccountGroupTeam(param) {
  return request({
    url: '/api/user/createUserAccountGroupTeam',
    method: 'post',
    data: param
  })
}

export function updateUserAccountGroupTeam(param) {
  return request({
    url: '/api/user/updateUserAccountGroupTeam',
    method: 'post',
    data: param
  })
}

export function deleteUserAccountGroupTeam(param) {
  return request({
    url: '/api/user/deleteUserAccountGroupTeam',
    method: 'post',
    data: param
  })
}
