<script setup>
import { cartStore } from '@/stores/cartStore';
import { computed, onMounted, ref } from 'vue';
import CartCard from '../cards/CartCard.vue';
import { formatToAmericanNumber } from '@/utils/helpers';

const cartModule = cartStore()

const cartTotalValue = computed(() => cartModule.getCartTotalAmount)
const cartTotalProductAmount = computed(() => cartModule.getCartTotalProductAmount)
const formattedTotalValue = computed(() => formatToAmericanNumber(cartTotalValue.value))

const renderCartCard = ref(false)

const handleCartCardState = () => {
    renderCartCard.value = !renderCartCard.value
}

</script>

<template>
    <ul class="d-flex align-items-center gap-5">
        <li>
            <p class="mb-0">Cart Total Value: U$ {{ formattedTotalValue || 0.00 }}</p>
        </li>
        <li class="position-relative">
            <button @click="handleCartCardState" class="px-3 py-2 position-relative border-0 rounded-3">
                <i class="bi bi-basket"></i>

                <span v-if="cartTotalProductAmount > 0" class="text-white d-flex justify-content-center align-items-center position-absolute cart-amount-items">
                    {{ cartTotalProductAmount || 0 }}
                </span>
            </button>

            <CartCard 
                v-if="renderCartCard"
                @handleCartCardState="handleCartCardState"
                :formattedTotalValue="formattedTotalValue"
            />
        </li>
    </ul>
</template>

<style>
.cart-amount-items {
    right: -8px;
    top: -8px;
    border-radius: 50%;
    font-size: 9px;
    background-color: red;
    width: 20px;
    height: 20px;
}
</style>