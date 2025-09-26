import cartService from "@/services/cartService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { notificationStore } from "./notificationStore";
import { productStore } from "./productStore";

export const cartStore = defineStore('cartStore', () => {
    const notificationModule = notificationStore()
    const productModule = productStore()

    const userCart = ref({})
    const userCartProducts = ref([])

    const getCartId = computed(() => userCart.value?.id)
    const getCartTotalAmount = computed(() => userCart.value?.total_amount)
    const getCartTotalProductAmount = computed(() => userCart.value?.total_items)
    const getCartProducts = computed(() => userCartProducts.value)

    const removeProductData = (productData) => {
        const productIndex = userCartProducts.value.findIndex((productRegister) => productRegister.product.id === productData.product_id)
        if (productIndex === -1) return

        const productPrice = Number(userCartProducts.value[productIndex].product.price)
        const totalValueRemoved = productPrice * productData.quantity

        if (typeof userCart.value.total_amount !== 'number') {
            userCart.value.total_amount = Number(userCart.value.total_amount)
        }

        userCart.value.total_amount -= totalValueRemoved
        userCart.value.total_items -= productData.quantity

        const productNewQuantity = userCartProducts.value[productIndex].quantity - productData.quantity

        productNewQuantity <= 0
            ? userCartProducts.value.splice(productIndex, 1)
            : userCartProducts.value[productIndex].quantity -= productData.quantity
    }

    const insertProductData = (productData) => {
        const productPrice = Number(productData.product.price)
        const totalValueInsert = productPrice * productData.quantity_insert

        if (typeof userCart.value.total_amount !== 'number') {
            userCart.value.total_amount = Number(userCart.value.total_amount)
        }
        userCart.value.total_amount += totalValueInsert
        userCart.value.total_items += productData.quantity_insert

        const productIndex = userCartProducts.value.findIndex((product) => product.id === productData.id)
        const productIsAlreadyInCart = Boolean(productIndex !== -1)

        productIsAlreadyInCart
            ? userCartProducts.value[productIndex] = productData
            : userCartProducts.value.push(productData)
    }

    const setUserCartData = (cartData) => {
        const { cart_products, ...rest } = cartData
        userCart.value = rest || {}
        userCartProducts.value = cart_products || []
    }

    const findUserCart = async (userId) => {
        try {
            const response = await cartService.findUserCart(userId)
            setUserCartData(response)
            return true
        } catch (error) {
            return false
        }
    }

    const resetCartData = () => {
        userCartProducts.value = []
        userCart.value.total_amount = 0
        userCart.value.total_items = 0
    }

    const createUserCart = async (payload) => {
        try {

            const response = await cartService.createUserCart(payload)
            setUserCartData(response)
        } catch (error) {
            notificationModule.activeErrorNotification(error)
        }
    }

    const insertProductInCart = async (payload) => {
        try {
            const response = await cartService.insertProductInCart(payload)
            insertProductData({ ...response, quantity_insert: payload.quantity })
            notificationModule.activeSuccessNotification("Product Insert In Cart!")
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    const removeProductFromCart = async (payload) => {
        try {
            await cartService.removeProducts(payload)
            removeProductData(payload)
            notificationModule.activeSuccessNotification("Product Removed From Cart!")
            return true
        } catch (error) {
            return false
        }
    }

    const removeAllProductsFromCart = async (payload) => {
        try {
            const productsToUpdateAvailableStock = userCartProducts.value.map((productData) =>
                ({ product_id: productData.product.id, quantity: productData.quantity }))

            await cartService.removeAllProducts(payload)
            resetCartData()

            productsToUpdateAvailableStock.map((productToUpdate) => {
                productModule.insertQuantityInProductStock(productToUpdate.quantity, productToUpdate.product_id)
            })

            notificationModule.activeSuccessNotification("Products Removed From Cart!")
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    const tryCheckout = async (payload) => {
        try {
            await cartService.tryCheckout(payload)
            resetCartData()
            await createUserCart(payload)
            notificationModule.activeSuccessNotification("Checkout Done!")
            return true
        } catch (error) {
            notificationModule.activeErrorNotification(error)
            return false
        }
    }

    return {
        tryCheckout,
        removeAllProductsFromCart,
        removeProductFromCart,
        getCartProducts,
        userCart,
        userCartProducts,
        insertProductInCart,
        getCartId,
        getCartTotalAmount,
        getCartTotalProductAmount,
        createUserCart,
        findUserCart
    }
})