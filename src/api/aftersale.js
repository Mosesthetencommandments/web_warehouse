import request from '@/utils/request'
// 获取所有列表
export function getAfterSaleList(param) {
  return request({
    url: '/api/aftersale/getAfterSaleList',
    method: 'post',
    data: param
  })
}
// 获取详细信息
export function getAfterSaleInfo(param) {
  return request({
    url: '/api/aftersale/getAfterSaleInfo',
    method: 'post',
    data: param
  })
}
// 操作售后单退货换货情况
export function updateAfterSaleWarehouse(param) {
  return request({
    url: '/api/aftersale/updateAfterSaleWarehouse',
    method: 'post',
    data: param
  })
}
