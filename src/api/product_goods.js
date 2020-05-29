import request from '@/utils/request'

export function getProductGoodsList(param) {
  return request({
    url: '/api/goods/getProductGoodsList',
    method: 'post',
    data: param
  })
}

export function createProductGoods(param) {
  return request({
    url: '/api/goods/createProductGoods',
    method: 'post',
    data: param
  })
}

export function updateProductGoods(param) {
  return request({
    url: '/api/goods/updateProductGoods',
    method: 'post',
    data: param
  })
}

export function deleteProductGoods(param) {
  return request({
    url: '/api/goods/deleteProductGoods',
    method: 'post',
    data: param
  })
}
export function createProductGoodCost(param) {
  return request({
    url: '/api/goods/createProductGoodCost',
    method: 'post',
    data: param
  })
}
export function getProductGoodCostList(param) {
  return request({
    url: '/api/goods/getProductGoodCostList',
    method: 'post',
    data: param
  })
}
