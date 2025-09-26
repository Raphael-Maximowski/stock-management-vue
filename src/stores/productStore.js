import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { notificationStore } from "./notificationStore";
import productService from "@/services/productService";

export const productStore = defineStore('productStore', () => {
    const notificationModule = notificationStore()

    const productsData = ref([])

    const getProductsData = computed(() => productsData.value)
    const getActiveProductsAmount = computed(() => productsData.value.length)

    const insertProductData = (data) => {
        data && (productsData.value.push(data))
    }

    const findProductIndexInArray = (productId) => {
        return productsData.value.findIndex((product) => product.id == productId)
    }

    const removeProductData = (productId) => {
        const productIndex = findProductIndexInArray(productId)
        productIndex !== -1 && (productsData.value.splice(productIndex, 1))
    }

    const setProductsData = (data) => {
        productsData.value = Array.isArray(data) ? data : []
    }

    const setProductData = (data) => {
        const productIndex = findProductIndexInArray(data?.id)
        productIndex !== 1 && (productsData.value[productIndex] = data)
    }

    const removeQuantityFromProductStock = (quantity, productId) => {
        const productIndex = productsData.value.findIndex((product) => product.id === productId)
        if (productIndex !== -1) {
            productsData.value[productIndex].available_stock -= quantity
            productsData.value[productIndex].reserved_stock += quantity
        }
    }

    const insertQuantityInProductStock = (quantity, productId) => {
        const productIndex = productsData.value.findIndex((product) => product.id === productId)
        if (productIndex !== -1) {
            productsData.value[productIndex].available_stock += quantity
            productsData.value[productIndex].reserved_stock -= quantity
        }
    }

    const requestUpdateProduct = async (payload) => {
        try {
            const response = await productService.updateProduct(payload)
            setProductData(response)
            notificationModule.activeSuccessNotification("Product Updated!")
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    const requestCreateProduct = async (payload) => {
        try {
            const response = await productService.createProduct(payload)
            insertProductData(response)
            notificationModule.activeSuccessNotification("Product Created!")
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    const requestProductsData = async () => {
        try {
            const response = await productService.requestProductsData()
            setProductsData(response)
        } catch (error) {
            notificationModule.activeErrorNotification(error)
        }
    }

    const requestDeleteProduct = async (productId) => {
        try {
            await productService.deleteProduct(productId)
            removeProductData(productId)
            notificationModule.activeSuccessNotification("Product Deleted!")
        } catch (error) {
            notificationModule.activeErrorNotification(error)
        }
    }

    return {
        insertQuantityInProductStock,
        removeQuantityFromProductStock,
        getActiveProductsAmount,
        requestUpdateProduct,
        requestCreateProduct,
        requestDeleteProduct,
        requestProductsData,
        productsData,
        getProductsData,
    }
}, { persist: true })