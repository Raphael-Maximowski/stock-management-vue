import { api } from "./api"


const requestProductsData = async () => {
    try {
        const response = await api.get('/products')
        return response.data
    } catch {
        throw new Error("Could Not Request Products")
    }
}

export  default {
    requestProductsData
}