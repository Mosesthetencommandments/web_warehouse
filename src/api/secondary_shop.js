import request from '@/utils/request'

export function getSecondaryShopOrdersList(param) {
  return request({
    url: '/api/secondary_shop/getSecondaryShopOrdersList',
    method: 'post',
    data: param
  })
}
export function updateSecondaryShopOrdersStatus(param) {
  return request({
    url: '/api/secondary_shop/updateSecondaryShopOrdersStatus',
    method: 'post',
    data: param
  })
}
export function updateSecondaryShopOrdersItems(param) {
  return request({
    url: '/api/secondary_shop/updateSecondaryShopOrdersItems',
    method: 'post',
    data: param
  })
}
