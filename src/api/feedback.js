import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/feedBack/admin.list',
        method: 'get',
        params
    })
}
