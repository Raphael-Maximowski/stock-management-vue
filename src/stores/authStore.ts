import { defineStore } from "pinia";
import { computed, ref } from "vue";
import authService from "@/services/authService";
import type { loginPayload, userInterface } from "@/typescript/interfaces/authInterfaces";
import { notificationStore } from "./notificationStore";

export const authStore = defineStore('authStore', () => {
    const notificationModule = notificationStore()

    const userData = ref<userInterface | undefined>(undefined)
    const userAuthToken = ref<string | undefined>(undefined)

    const getUserRole = computed(() => userData?.value?.role)
    const getAuthToken = computed(() => userAuthToken.value)

    const setUserToken = (authToken: string | undefined) => {
        userAuthToken.value = authToken || undefined
    }

    const setUserData = (data: userInterface | undefined) => {
        userData.value = data || undefined
    }

    const tryLogin = async (payload: loginPayload) => {
        try {
            const response = await authService.tryLogin(payload)
            setUserData(response?.user)
            setUserToken(response?.token)
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    const tryRegister = async (payload) => {
        try {
            const response = await authService.tryRegister(payload)
            setUserData(response?.user)
            setUserToken(response?.token)
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    return {
        userData,
        userAuthToken,
        getAuthToken,
        getUserRole,
        setUserData,
        setUserToken,
        tryLogin,
        tryRegister
    }
}, { persist: true, })