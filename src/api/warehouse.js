import request from '@/utils/request'

export function getProdcutStorageImportList(param) {
  return request({
    url: 'api/warehouse/getProdcutStorageImportList',
    method: 'post',
    data: param
  })
}

export function deleteProductStorageImport(param) {
  return request({
    url: 'api/warehouse/deleteProductStorageImport ',
    method: 'post',
    data: param
  })
}

export function createProductStorageImport(param) {
  return request({
    url: 'api/warehouse/createProductStorageImport ',
    method: 'post',
    data: param
  })
}
export function getWarehouseProductGoodsStorageList(param) {
  return request({
    url: 'api/warehouse/getWarehouseProductGoodsStorageList ',
    method: 'post',
    data: param
  })
}
export function getProductGoodsStorageList(param) {
  return request({
    url: 'api/warehouse/getProductGoodsStorageList ',
    method: 'post',
    data: param
  })
}
export function getWarehouseGroupList(param) {
  return request({
    url: 'api/warehouse/getWarehouseGroupList ',
    method: 'post',
    data: param
  })
}

