import { generateApiError } from "@/utils/helpers"
import { api } from "./api"

const requestProductsData = async () => {
    try {
        const response = await api.get('/products')
        return response.data
    } catch {
        throw new Error("Could Not Request Products")
    }
}

const deleteProduct = async (productId) => {
    try {
        await api.delete(`/products/${productId}`)
    } catch {
        throw new Error("An Error Ocurred When Deleting! Try Again")
    }
}

const createProduct = async (payload) => {
    try {
        const response = await api.post('/products', payload)
        return response.data
    } catch (error) {
        const errorMessage = generateApiError(error?.response?.data?.error)
        throw new Error(errorMessage)
    }
}

const updateProduct = async (payload) => {
    try {
        const response = await api.put(`/products/${payload?.product_id}`, payload)
        return response.data
    } catch (error) {
        const errorMessage = generateApiError(error?.response?.data?.error)
        throw new Error(errorMessage)
    }
}

export default {
    updateProduct,
    createProduct,
    deleteProduct,
    requestProductsData
}