<script setup>
import { cartStore } from '@/stores/cartStore';
import { notificationStore } from '@/stores/notificationStore';
import { productStore } from '@/stores/productStore';
import { formatToAmericanNumber } from '@/utils/helpers';
import { computed, ref } from 'vue';

const props = defineProps({
    productData: { type: Object },
    indexInLoop: { type: Number },
    userId: { type: Number },
    cartId: { type: Number }
})

const cartModule = cartStore()
const notificationModule = notificationStore()
const productModule = productStore()

const productDataReference = computed(() => props.productData)
const productTotalPrice = computed(() => productDataReference.value.product.price * productDataReference.value.quantity)
const formattedTotalPrice = computed(() => formatToAmericanNumber(productTotalPrice.value || 0))

const quantityToRemove = ref(0)
const cardInRemoveContext = ref(false)

const handleCardInRemoveContext = () => {
    cardInRemoveContext.value = !cardInRemoveContext.value
}

const handleQuantityToRemoveInput = (event) => {
  const eventValue = event.target.value
  const regex = /^[0-9]+$/;

  if (regex.test(eventValue)) {
    quantityToRemove.value = Number(eventValue);
    return 
  }

  event.target.value = ''
}

const resetDataRelatedToRemoveProduct = () => {
    handleCardInRemoveContext()
    quantityToRemove.value = 0
}

const validateQuantityToRemove = () => {
    if (quantityToRemove.value > productDataReference.value.quantity) {
        notificationModule.activeErrorNotification("Invalid Quantity To Remove")
        return false
    }

    return true
}

const removeProductFromCart = async (quantity = quantityToRemove.value) => {
    if (!await validateQuantityToRemove()) return

    const requestData = {
        user_id: props.userId,
        cart_id: props.cartId,
        product_id: productDataReference?.value?.product?.id,
        quantity: quantity
    }

    const requestSucced = await cartModule.removeProductFromCart(requestData)

    if (requestSucced) {
        await productModule.insertQuantityInProductStock(quantity, productDataReference?.value?.product?.id)
        resetDataRelatedToRemoveProduct()
    }
}
</script>

<template>
    <div>
        <div class=" product-in-cart-container pb-3">
            <p class="mb-0 overflow-hidden">Name: {{ productDataReference?.product?.name || 'Product Name' }}</p>
            <p class="mb-0 overflow-hidden">Total Price: U$ {{ formattedTotalPrice  }}</p>
            <p class="mb-0 overflow-hidden">Quantity: {{ productDataReference?.quantity || 0 }}</p>

            <div class="d-flex mt-2">
                <button @click="handleCardInRemoveContext" v-if="!cardInRemoveContext" class="py-1 btn-danger btn">
                    Remove Product
                </button>

                <div class="d-flex gap-2 flex-column w-100" v-else>
                    <div class="d-flex align-items-center  gap-2">
                        <button @click="removeProductFromCart()" class="remove-product-button py-1 btn-danger btn">
                            Remove Quantity
                        </button> 
                        <input @change="event => handleQuantityToRemoveInput(event)" class="form-control text-center" placeholder="0" />
                    </div>
                    <button @click="removeProductFromCart(productDataReference?.quantity)" class="remove-product-button py-1 btn-danger btn">
                        Remove All
                    </button> 
                    <button @click="handleCardInRemoveContext" class="remove-product-button py-1 btn-secondary btn">
                        Cancel
                    </button> 
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.remove-product-button {
    width: 150px;
}

input {
    width: 40px;
}

button, input {
    font-size: 10px;
}

.product-in-cart-container {
    border-bottom: 1px solid lightgray;
}

p {
    font-size: 12px;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>