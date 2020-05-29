import request from '@/utils/request'

export function getProductWeixinFansAddressList(param) {
  return request({
    url: '/api/product/getProductWeixinFansAddressList',
    method: 'post',
    data: param
  })
}

export function createProductWeixinFansAddress(param) {
  return request({
    url: '/api/product/createProductWeixinFansAddress',
    method: 'post',
    data: param
  })
}

export function updateProductWeixinFansAddress(param) {
  return request({
    url: '/api/product/updateProductWeixinFansAddress',
    method: 'post',
    data: param
  })
}

export function deleteProductWeixinFansAddress(param) {
  return request({
    url: '/api/product/deleteProductWeixinFansAddress',
    method: 'post',
    data: param
  })
}

export function createProductWeixinFans(param) {
  return request({
    url: '/api/product/createProductWeixinFans',
    method: 'post',
    data: param
  })
}

export function getDateAddFansInfo(param) {
  return request({
    url: '/api/product/getDateAddFansInfo',
    method: 'post',
    data: param
  })
}

export function updateProductWeixinRecord(param) {
  return request({
    url: '/api/product/updateProductWeixinRecord',
    method: 'post',
    data: param
  })
}

export function getDateUnfilledFansInfo(param) {
  return request({
    url: '/api/product/getDateUnfilledFansInfo',
    method: 'post',
    data: param
  })
}

export function updateProductWeixinUnfilled(param) {
  return request({
    url: '/api/product/updateProductWeixinUnfilled',
    method: 'post',
    data: param
  })
}
