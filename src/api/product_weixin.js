import request from '@/utils/request'

export function getProductWeixinList(param) {
  return request({
    url: '/api/product/getProductWeixinList',
    method: 'post',
    data: param
  })
}

export function createProductWeixin(param) {
  return request({
    url: '/api/product/createProductWeixin',
    method: 'post',
    data: param
  })
}

export function updateProductWeixin(param) {
  return request({
    url: '/api/product/updateProductWeixin',
    method: 'post',
    data: param
  })
}

export function getProductWeixinFansList(param) {
  return request({
    url: '/api/product/getProductWeixinFansList',
    method: 'post',
    data: param
  })
}

export function getProductWeixinFansPivotList(param) {
  return request({
    url: '/api/product/getProductWeixinFansPivotList',
    method: 'post',
    data: param
  })
}

export function updateProductWeixinFans(param) {
  return request({
    url: '/api/product/updateProductWeixinFans',
    method: 'post',
    data: param
  })
}

export function getPromotionChannelList(param) {
  return request({
    url: '/api/promotion/getPromotionChannelList',
    method: 'post',
    data: param
  })
}

export function getProductWeixinLogsList(param) {
  return request({
    url: '/api/product/getProductWeixinLogsList',
    method: 'post',
    data: param
  })
}
