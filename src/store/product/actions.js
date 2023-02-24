import { deleteProduct, getProducts, getProductTypes, postProduct, updateProduct } from "src/api/product";

export function getProductsAction ( context ) {
    return new Promise((resolve, reject) => {
        getProducts()
        .then((response) => {
            context.commit('setProducts', response.data);
            resolve(true)
        }).catch(error => {
            reject(error);
        })
    })
}

export function updateProductAction(context, productId) {
    return new Promise((resolve, reject) => {
        updateProduct(productId)
        .then(() => {
            context.dispatch('getProductsAction')
            .then(() => {
                resolve(true)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

export function postProductAction(context, productId) {
    return new Promise((resolve, reject) => {
        postProduct(productId)
        .then(() => {
            context.dispatch('getProductsAction')
            .then(() => {
                resolve(true)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

export function deleteProductAction(context, data) {
    return new Promise((resolve, reject) => {
        deleteProduct(data)
        .then(() => {
            context.dispatch('getProductsAction', {page: 1})
            .then(() => {
                resolve(true)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

export function getProductTypesAction(context) {
    return new Promise((resolve, reject) => {
        getProductTypes()
        .then(response => {
            context.commit('setProductTypes', response.data)
        }).catch(error => {
            reject(error)
        })
    })
}