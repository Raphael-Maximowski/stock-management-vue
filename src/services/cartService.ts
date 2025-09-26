import { api } from "./api"


const findUserCart = async (userId) => {
    try {
        const response = await api.get(`/cart/user/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const createUserCart = async (payload) => {
    try {
        const response = await api.post('/carts', payload)
        return response.data
    } catch {
        throw new Error("An Error Ocurred Whilt Creating Cart! Try Again")
    }
}

const insertProductInCart = async (payload) => {
    try {
        const response = await api.post(`/carts/${payload.cartId}/insert/${payload.productId}`, payload)
        return response.data
    } catch {
        throw new Error("Not Available Product!")
    }
}

const removeProducts = async (params) => {
    try {
        await api.put(`/carts/${params.cart_id}/remove/${params.product_id}`, params)
    } catch {
        throw new Error("An Errror Ocurred While Removing Items! Try Again")
    }
}

export const removeAllProducts = async (params) => {
    try {
        await api.put(`/carts/${params.cart_id}/remove-all-products`, params)
    } catch {
        throw new Error("An Errror Ocurred While Removing Items! Try Again")
    }
}

export const tryCheckout = async (params) => {
    try {
        await api.post(`carts/${params.cart_id}/checkout`, params)
    } catch {
        throw new Error("An Errror Ocurred With Checkout! Try Again")
    }
}

export default {
    tryCheckout,
    removeProducts,
    removeAllProducts,
    insertProductInCart,
    createUserCart,
    findUserCart
}