import { api } from "./api"
import { generateApiError } from "@/utils/helpers"

const tryLogin = async (payload) => {
    try {
        const response = await api.post('/auth/login', payload)
        return response.data
    } catch (error) {
        const errorMessage = generateApiError(error?.response?.data?.error)
        throw new Error(errorMessage)
    }
}

const tryRegister = async (payload) => {
    try {
        const response = await api.post('/auth/register', payload)
        return response.data
    } catch (error) {
        const errorMessage = generateApiError(error?.response?.data?.error)

        throw new Error(errorMessage)
    }
}

export default {
    tryLogin,
    tryRegister
}