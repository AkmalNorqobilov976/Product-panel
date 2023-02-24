import { request } from '../boot/axios'

const URI = 'product'

export function getProducts() {
    return request({
        url: `${URI}`,
        method: 'get'
    })
}

export function updateProduct(data) {
    return request({
        url: `${URI}`,
        method: 'put',
        data: data
    })
}

export function postProduct(data) {
    return request({
        url: `${URI}`,
        method: 'post',
        data: data
    })
}

export function deleteProduct(productId) {
    return request({
        url: `${URI}/${productId}`,
        method: 'delete'
    })
}

export function getProductTypes() {
    return request({
        url: `${URI}/get-product-types`,
        method: 'get'
    })
}