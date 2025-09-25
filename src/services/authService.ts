import type { loginPayload } from "@/typescript/interfaces/authInterfaces"
import { api } from "./api"
import { generateApiError } from "@/utils/helpers"


const DEFAULT_ERROR_MESSAGE = 'Ocorreu um erro! Tente novamente'

const tryLogin = async (payload: loginPayload) => {
    try {
        const response = await api.post('/auth/login', payload)
        return response.data
    } catch (error: any) {
        const errorMessage = generateApiError(error?.response?.data?.error)
        throw new Error(errorMessage)
    }
}

const tryRegister = async (payload) => {
    try {
        const response = await api.post('/auth/register', payload)
        return response.data
    } catch (error: any) {
        const errorMessage = generateApiError(error?.response?.data?.error)

        throw new Error(errorMessage)
    }
}

export default {
    tryLogin,
    tryRegister
}