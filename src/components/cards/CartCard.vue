
<script setup>
import { cartStore } from '@/stores/cartStore';
import { computed, ref } from 'vue';
import ProductInCartCard from './ProductInCartCard.vue';
import { authStore } from '@/stores/authStore';

const emits = defineEmits(['handleCartCardState'])
defineProps({
    formattedTotalValue: { type: Number }
})

const authModule = authStore()
const cartModule = cartStore()
const cartProducts = computed(() => cartModule.getCartProducts)
const renderManipulateCardButtons = computed(() => Array.isArray(cartProducts.value) && cartProducts.value.length > 0 )
const userId = computed(() => authModule.getUserId)
const cartId = computed(() => cartModule.getCartId)

const removeAllProducts = () => {
    const requestData = {
        user_id: userId.value,
        cart_id: cartId.value
    }
    
    const requestSucced = cartModule.removeAllProductsFromCart(requestData)
    requestSucced && (closeCard())
}

const closeCard = () => {
    emits('handleCartCardState')
}

const tryCheckout = async () => {
    const requestData = {
        user_id: userId.value,
        cart_id: cartId.value
    }

    const requestSucced = await cartModule.tryCheckout(requestData)
    requestSucced && (closeCard())
}

</script>

<template>
    <div class="d-flex flex-column gap-2 bg-white rounded-2 px-4 py-3  shadow position-absolute cart-container">
        <p class="mb-0 fw-bold">Cart Products</p>

        <p class="mb-0">Total Value: U$ {{  formattedTotalValue  }}</p>

        <button v-if="renderManipulateCardButtons" @click="tryCheckout" class="py-1 btn btn-dark">
            Checkout
        </button>

        <div class="d-flex flex-column gap-3 overflow-y-auto flex-grow-1 products-list ">
            
            <ProductInCartCard 
                v-for="(product, index) in cartProducts"
                :key="product.id"
                :productData="product"
                :indexInLoop="index"
                :userId="userId"
                :cartId="cartId"
            />
        </div>

        <button v-if="renderManipulateCardButtons" @click="removeAllProducts" class="py-1 btn btn-danger">
            Clear Cart
        </button>
    </div>
</template>

<style scoped>
p {
    font-size: 14px;
}

button {
    font-size: 12px;
}

.cart-container {
    top: calc(100% + 10px);
    right: 0px;
    width: 300px;
    height: 400px;
}

@media(max-width: 700px) {
    .cart-container {
        width: 250px;
        height: 400px;
    }
}
</style>