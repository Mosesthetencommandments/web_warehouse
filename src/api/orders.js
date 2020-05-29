import request from '@/utils/request'

export function getOrdersList(param) {
  return request({
    url: '/api/orders/getOrdersList',
    method: 'post',
    data: param
  })
}

export function createOrders(param) {
  return request({
    url: '/api/orders/createOrders',
    method: 'post',
    data: param
  })
}

export function updateOrders(param) {
  return request({
    url: '/api/orders/updateOrders',
    method: 'post',
    data: param
  })
}

export function createOrdersItem(param) {
  return request({
    url: '/api/orders/createOrdersItem',
    method: 'post',
    data: param
  })
}

export function updateOrdersItem(param) {
  return request({
    url: '/api/orders/updateOrdersItem',
    method: 'post',
    data: param
  })
}

export function deleteOrdersItem(param) {
  return request({
    url: '/api/orders/deleteOrdersItem',
    method: 'post',
    data: param
  })
}

export function createOrdersRemark(param) {
  return request({
    url: '/api/orders/createOrdersRemark',
    method: 'post',
    data: param
  })
}

export function deleteOrdersRemark(param) {
  return request({
    url: '/api/orders/deleteOrdersRemark',
    method: 'post',
    data: param
  })
}

export function updateOrdersLogistics(param) {
  return request({
    url: '/api/orders/updateOrdersLogistics',
    method: 'post',
    data: param
  })
}

export function getOrdersLogisticsTypeList(param) {
  return request({
    url: '/api/logistics/getOrdersLogisticsTypeList',
    method: 'post',
    data: param
  })
}

export function createOrdersPaymentItem(param) {
  return request({
    url: '/api/orders/createOrdersPaymentItem',
    method: 'post',
    data: param
  })
}

export function updateOrdersPaymentItem(param) {
  return request({
    url: '/api/orders/updateOrdersPaymentItem',
    method: 'post',
    data: param
  })
}

export function updateOrdersPaymentItemMassively(param) {
  return request({
    url: '/api/orders/updateOrdersPaymentItemMassively',
    method: 'post',
    data: param
  })
}

export function deleteOrdersPaymentItem(param) {
  return request({
    url: '/api/orders/deleteOrdersPaymentItem',
    method: 'post',
    data: param
  })
}

export function getOrdersPayTypeList(param) {
  return request({
    url: '/api/orders/getOrdersPayTypeList',
    method: 'post',
    data: param
  })
}

export function getOrdersPayProofList(param) {
  return request({
    url: '/api/orders/getOrdersPayProofList',
    method: 'post',
    data: param
  })
}

export function getOrdersSFLogisticsNumber(param) {
  return request({
    url: '/api/orders/getOrdersSFLogisticsNumber',
    method: 'post',
    data: param
  })
}
export function getOrdersCountInfo(param) {
  return request({
    url: '/api/orders/getOrdersCountInfo',
    method: 'post',
    data: param
  })
}

export function getOrdersLogsList(param) {
  return request({
    url: '/api/orders/getOrdersLogsList',
    method: 'post',
    data: param
  })
}
export function getOrdersYTOLogisticsNumber(param) {
  return request({
    url: '/api/orders/getOrdersYTOLogisticsNumber',
    method: 'post',
    data: param
  })
}

export function getOrdersZTOLogisticsNumber(param) {
  return request({
    url: '/api/orders/getOrdersZTOLogisticsNumber',
    method: 'post',
    data: param
  })
}

export function downloadNeedCheckOrder(param) {
  return request({
    url: '/api/orders/downloadNeedCheckOrder',
    method: 'post',
    data: param
  })
}

export function getOrdersAreaList(param) {
  return request({
    url: '/api/logistics/getOrdersAreaList',
    method: 'post',
    data: param
  })
}
export function getOrdersSensitiveList(param) {
  return request({
    url: '/api/logistics/getOrdersSensitiveList',
    method: 'post',
    data: param
  })
}
export function createOrdersSensitive(param) {
  return request({
    url: '/api/logistics/createOrdersSensitive',
    method: 'post',
    data: param
  })
}
export function updateOrdersSensitive(param) {
  return request({
    url: '/api/logistics/updateOrdersSensitive',
    method: 'post',
    data: param
  })
}
export function deleteOrdersSensitive(param) {
  return request({
    url: '/api/logistics/deleteOrdersSensitive',
    method: 'post',
    data: param
  })
}
export function checkOrders(param) {
  return request({
    url: '/api/orders/checkOrders',
    method: 'post',
    data: param
  })
}
export function deliverOrders(param) {
  return request({
    url: '/api/orders/deliverOrders',
    method: 'post',
    data: param
  })
}
export function handleOrders(param) {
  return request({
    url: '/api/orders/handleOrders',
    method: 'post',
    data: param
  })
}
export function resultOrders(param) {
  return request({
    url: '/api/orders/resultOrders',
    method: 'post',
    data: param
  })
}
export function destroyOrders(param) {
  return request({
    url: '/api/orders/destroyOrders',
    method: 'post',
    data: param
  })
}
export function findOrdersList(param) {
  return request({
    url: '/api/orders/findOrdersList',
    method: 'post',
    data: param
  })
}
export function getDailyLogisticsOrdersCountStatistics(param) {
  return request({
    url: '/api/orders/getDailyLogisticsOrdersCountStatistics',
    method: 'post',
    data: param
  })
}
export function getSecondaryShopOrdersList(param) {
  return request({
    url: '/api/orders/getSecondaryShopOrdersList',
    method: 'post',
    data: param
  })
}
export function deliverSecondaryShopOrders(param) {
  return request({
    url: '/api/orders/deliverSecondaryShopOrders',
    method: 'post',
    data: param
  })
}
export function cancelSecondaryShopOrders(param) {
  return request({
    url: '/api/orders/cancelSecondaryShopOrders',
    method: 'post',
    data: param
  })
}
export function getOrdersDepponLogisticsNumber(param) {
  return request({
    url: '/api/orders/getOrdersDepponLogisticsNumber',
    method: 'post',
    data: param
  })
}
export function updateOrdersLogisticsPrintTimes(param) {
  return request({
    url: '/api/orders/updateOrdersLogisticsPrintTimes',
    method: 'post',
    data: param
  })
}
export function updateOrdersLogisticsNumber(param) {
  return request({
    url: '/api/orders/updateOrdersLogisticsNumber',
    method: 'post',
    data: param
  })
}

