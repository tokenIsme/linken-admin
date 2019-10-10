import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/device/admin.deviceList',
    method: 'get',
    params
  })
}
export function getUploadUrl(params) {
  return request({
    url: '/device/admin.getUploadUrl',
    method: 'get',
    params
  })
}

export function del(params) {
  return request({
    url: '/device/admin.del',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/device/admin.saveOrUpdate',
    method: 'post',
    data
  })
}