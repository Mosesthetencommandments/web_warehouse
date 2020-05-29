import request from '@/utils/request'

export function getFinanceGroupList(param) {
  return request({
    url: '/api/finance/getFinanceGroupList',
    method: 'post',
    data: param
  })
}

