import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { notificationStore } from "./notificationStore";
import productService from "@/services/productService";

export const productStore = defineStore('productStore', () => {
    const notificationModule = notificationStore()

    const productsData = ref([])

    const getProductsData = computed(() => productsData.value)
    const getActiveProductsAmount = computed(() => productsData.value.length)

    const findProductIndexInArray = (productId) => {
        productsData.value.findIndex((product) => product.id === data.id)
    }

    const removeProductData = (productId) => {
        const productIndex = findProductIndexInArray(productId)
    }

    const setProductData = (data) => {
        const productIndex = findProductIndexInArray(productId)
        productIndex !== 1 && (productsData[productIndex] = data)
    }

    const setProductsData = (data) => {
        productsData.value = Array.isArray(data) ? data : []
        console.log("Products: ", productsData.value)
    }

    const requestProductsData = async () => {
        try {
            const response = await productService.requestProductsData()
            setProductsData(response)
        } catch (error) {
            notificationModule.activeErrorNotification(error)
        }
    }

    return {
        getActiveProductsAmount,
        requestProductsData,
        productsData,
        getProductsData,
    }
}, { persist: true })