<script setup>
import { authStore } from '@/stores/authStore';
import { cartStore } from '@/stores/cartStore';
import { notificationStore } from '@/stores/notificationStore';
import { productStore } from '@/stores/productStore';
import { computed, ref } from 'vue';

const props = defineProps({
    product: { type: Object }
})

const productModule = productStore()
const cartModule = cartStore()
const notificationModule = notificationStore()
const authModule = authStore()

const userId = computed(() => authModule.getUserId)
const cartId = computed(() => cartModule.getCartId)
const productReference = computed(() => props.product)
const renderInsertInCartButton = computed(() => typeof productAmountSelected.value === 'number' 
&& productAmountSelected.value > 0)

const productAmountSelected = ref(0)

const validateProductAmount = (productAmount = productAmountSelected.value) => {
    const formattedAmount = Number(productAmount)
    if (formattedAmount < 0) {
        notificationModule.activeErrorNotification("Cannot Decrement Zero")
        return false
    }

    if (formattedAmount > productReference.value?.available_stock) {
        notificationModule.activeErrorNotification("Product Available Stock Is Over")
        return false
    }

    return true
}

const decrementProductAmount = () => {
    const tagetValue = productAmountSelected.value - 1
    if (!validateProductAmount(tagetValue)) return

    productAmountSelected.value--
}

const incrementProductAmount = () => {
    const targetValue = productAmountSelected.value + 1
    if (!validateProductAmount(targetValue)) return

    productAmountSelected.value++
}

const handleProductAmount = (event) => {
  const eventValue = event.target.value
  const regex = /^[0-9]+$/;

  if (regex.test(eventValue)) {
    productAmountSelected.value = Number(eventValue);
    return 
  }

  event.target.value = ''
}

const resetProductAmountSelected = () => {
    productAmountSelected.value = 0
}

const removeProductQuantityFromStock = (quantity, productId) => {
    productModule.removeQuantityFromProductStock(quantity, productId)
}

const registerProductInCart = async() => {
    if (!await validateProductAmount()) return

    const requestPayload = {
        cartId: cartId.value,
        productId: productReference.value.id,
        quantity: productAmountSelected.value,
        user_id: userId.value
    }

    const requestSucced = await cartModule.insertProductInCart(requestPayload)

    if (requestSucced) {
        await removeProductQuantityFromStock(productAmountSelected.value, productReference.value.id)
        resetProductAmountSelected()
    }
}

</script>

<template>
    <div class="product-wrapper  flex-wrap gap-3 align-items-center d-flex justify-content-between  px-3 rounded-3 py-3">
        <div class="col-12 col-lg-6 col-xl-8"> 
            <p class="mb-0 overflow-hidden product-info">{{  product?.name  }}</p>
        </div>
        <div class="px-3 align-items-center flex-wrap d-flex gap-4 flex-grow-1 justify-content-between">
            <p class="mb-0">
                <span class="fw-bold">Price: </span>
                U$ {{  productReference?.price  }}
            </p>

            <div class="d-flex gap-2">
                <button @click="decrementProductAmount" class="border-0 bg-transparent">
                    <i class="bi bi-dash-circle-fill"></i>
                </button>
                <input :value="productAmountSelected" @input="event => handleProductAmount(event)" class="form-control product-amount text-center" placeholder="0" />
                <button @click="incrementProductAmount" class="border-0 bg-transparent">
                    <i class="bi bi-plus-circle-fill"></i>
                </button>

                <button 
                    @click="registerProductInCart" 
                    v-if="renderInsertInCartButton" 
                    class="border-0 bg-transparent"
                >
                    <i class="bi bi-bag-plus-fill"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

input {
    width: 80px;
}

.product-info {

    text-overflow: ellipsis;
}

.product-wrapper {
    border: 1px solid lightgray;
}
</style>