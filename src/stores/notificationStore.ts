import { defineStore } from "pinia";
import { toast, type ToastOptions } from 'vue3-toastify';

export const notificationStore = defineStore('notificationStore', () => {

    const activeSuccessNotification = (text: string) => {
        toast(text, {
            type: 'success'
        })
    }

    const activeErrorNotification = (text: string) => {
        toast(text, {
            type: 'error'
        })
    }

    return {
        activeSuccessNotification,
        activeErrorNotification
    }
})