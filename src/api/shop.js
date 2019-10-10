import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/salesServicShop/admin.shopList',
    method: 'get',
    params
  })
}
export function del(params) {
  return request({
    url: '/salesServicShop/admin.del',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/salesServicShop/admin.saveOrUpdate',
    method: 'post',
    data
  })
}