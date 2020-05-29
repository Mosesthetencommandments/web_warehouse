import request from '@/utils/request'

export function createUserAccountDepartment(param) {
  return request({
    url: '/api/user/createUserAccountDepartment',
    method: 'post',
    data: param
  })
}

export function updateUserAccountDepartment(param) {
  return request({
    url: '/api/user/updateUserAccountDepartment',
    method: 'post',
    data: param
  })
}

export function getUserAccountDepartmentList(param) {
  return request({
    url: '/api/user/getUserAccountDepartmentList',
    method: 'post',
    data: param
  })
}

export function getUserAccountDepartmentGroupTree(param) {
  return request({
    url: '/api/user/getUserAccountDepartmentGroupTree',
    method: 'post',
    data: param
  })
}

