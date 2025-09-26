import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';

export const notificationStore = defineStore('notificationStore', () => {

    // Actions

    const activeSuccessNotification = (text) => {
        toast(text, {
            type: 'success'
        })
    }

    const activeErrorNotification = (text) => {
        toast(text, {
            type: 'error'
        })
    }

    return {
        activeSuccessNotification,
        activeErrorNotification
    }
})