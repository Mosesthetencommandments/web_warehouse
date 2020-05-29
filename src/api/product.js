import request from '@/utils/request'

export function getProductList(param) {
  return request({
    url: '/api/product/getProductList',
    method: 'post',
    data: param
  })
}

export function createProduct(param) {
  return request({
    url: '/api/product/createProduct',
    method: 'post',
    data: param
  })
}

export function getProductWeixinFansRegist(param) {
  return request({
    url: '/api/product/getProductWeixinFansRegist',
    method: 'post',
    data: param
  })
}

export function updateProduct(param) {
  return request({
    url: '/api/product/updateProduct',
    method: 'post',
    data: param
  })
}

export function deleteProduct(param) {
  return request({
    url: '/api/product/deleteProduct',
    method: 'post',
    data: param
  })
}

export function getProductTemplateList(param) {
  return request({
    url: '/api/product/getProductTemplateList',
    method: 'post',
    data: param
  })
}

export function getProductTemplateInfo(param) {
  return request({
    url: '/api/product/getProductTemplateInfo',
    method: 'post',
    data: param
  })
}

export function createProductTemplate(param) {
  return request({
    url: '/api/product/createProductTemplate',
    method: 'post',
    data: param
  })
}

export function updateProductTemplate(param) {
  return request({
    url: '/api/product/updateProductTemplate',
    method: 'post',
    data: param
  })
}

export function deleteProductTemplate(param) {
  return request({
    url: '/api/product/deleteProductTemplate',
    method: 'post',
    data: param
  })
}

export function releaseProductTemplate(param) {
  return request({
    url: '/api/product/releaseProductTemplate',
    method: 'post',
    data: param
  })
}

export function previewProductTemplate(param) {
  return request({
    url: '/api/product/previewProductTemplate',
    method: 'post',
    data: param
  })
}

export function getProductStorageDetailList(param) {
  return request({
    url: '/api/warehouse/getProductStorageDetailList ',
    method: 'post',
    data: param
  })
}

export function getProductStorageAdjustList(param) {
  return request({
    url: '/api/warehouse/getProductStorageAdjustList ',
    method: 'post',
    data: param
  })
}

export function createProductStorageAdjust(param) {
  return request({
    url: '/api/warehouse/createProductStorageAdjust ',
    method: 'post',
    data: param
  })
}
export function getProductStorageByDay(param) {
  return request({
    url: '/api/warehouse/getProductStorageByDay ',
    method: 'post',
    data: param
  })
}
export function getProductStorageOrderList(param) {
  return request({
    url: '/api/warehouse/getProductStorageOrderList ',
    method: 'post',
    data: param
  })
}
export function createProductStorageOrder(param) {
  return request({
    url: '/api/warehouse/createProductStorageOrder ',
    method: 'post',
    data: param
  })
}
export function deleteProductStorageOrder(param) {
  return request({
    url: '/api/warehouse/deleteProductStorageOrder ',
    method: 'post',
    data: param
  })
}
export function getProdcutStorageImportList(param) {
  return request({
    url: '/api/warehouse/getProdcutStorageImportList ',
    method: 'post',
    data: param
  })
}
export function updateProductStorageOrder(param) {
  return request({
    url: '/api/warehouse/updateProductStorageOrder ',
    method: 'post',
    data: param
  })
}
export function createProductStorageImport(param) {
  return request({
    url: '/api/warehouse/createProductStorageImport ',
    method: 'post',
    data: param
  })
}
export function deleteProductStorageImport(param) {
  return request({
    url: '/api/warehouse/deleteProductStorageImport ',
    method: 'post',
    data: param
  })
}
export function updateProductStorageImport(param) {
  return request({
    url: '/api/warehouse/updateProductStorageImport ',
    method: 'post',
    data: param
  })
}
export function updateProductStorageManual(param) {
  return request({
    url: '/api/warehouse/updateProductStorageManual ',
    method: 'post',
    data: param
  })
}
export function createProductStorageManual(param) {
  return request({
    url: '/api/warehouse/createProductStorageManual ',
    method: 'post',
    data: param
  })
}
export function getProductStorageManualList(param) {
  return request({
    url: '/api/warehouse/getProductStorageManualList ',
    method: 'post',
    data: param
  })
}
export function deleteProductStorageManual(param) {
  return request({
    url: '/api/warehouse/deleteProductStorageManual ',
    method: 'post',
    data: param
  })
}

export function updateWarehouse(param) {
  return request({
    url: '/api/logistics/updateWarehouse ',
    method: 'post',
    data: param
  })
}

export function createWarehouse(param) {
  return request({
    url: '/api/logistics/createWarehouse ',
    method: 'post',
    data: param
  })
}

export function getWarehouseList(param) {
  return request({
    url: '/api/logistics/getWarehouseList ',
    method: 'post',
    data: param
  })
}

export function createWarehouseExtra(param) {
  return request({
    url: '/api/logistics/createWarehouseExtra ',
    method: 'post',
    data: param
  })
}

export function getWarehouseLogisticsExtraList(param) {
  return request({
    url: '/api/logistics/getWarehouseLogisticsExtraList ',
    method: 'post',
    data: param
  })
}

export function updateWarehouseLogisticsExtra(param) {
  return request({
    url: '/api/logistics/updateWarehouseLogisticsExtra ',
    method: 'post',
    data: param
  })
}

