<script setup>
import { notificationStore } from '@/stores/notificationStore';
import { computed, onMounted, ref, watch } from 'vue';
import { unformat, format } from "v-money3";
import { productStore } from '@/stores/productStore';
import { authStore } from '@/stores/authStore';

const emits = defineEmits(['handleProdutManagementModalState', 'setProductDataToUpdate'])
const props = defineProps({
  productData: { type: Object }
})

const authModule = authStore()
const productModule = productStore()
const notificationModule = notificationStore()
const productDataReference = computed(() => props.productData)
const modalInUpdateMode = computed(() => !!productDataReference.value)
const userId = computed(() => authModule.getUserId)
const productName = ref(productDataReference.value?.name || null)
const productAvailableStock = ref(productDataReference.value?.available_stock || 0)
const productDescription = ref(productDataReference.value?.description || null)
const productPrice = ref(productDataReference.value?.price || 0.0)
const productPriceMock = ref(null)
const moneyMaskSettings = { decimal: '.', thousands: ',', prefix: 'U$ ', precision: 2, masked: true }

const validateProductData = () => {
  const productsHash = { 
    name: productName.value, 
    price: productPrice.value, 
    available_stock: productAvailableStock.value, 
    description: productDescription.value 
  }
  const productKeys = Object.keys(productsHash)

  for (let i = 0; i < productKeys.length; i ++) {
    const key = productKeys[i]
    if ( key !== 'description' && (productsHash[key] == null || productsHash[key] == undefined) ) {
      notificationModule.activeErrorNotification("All Fields Are Required")
      return false
    }

    if ( key !== 'description' && !productsHash[key].length > 255) {
      const errorMessage = `${key} max length is 255`
      notificationModule.activeErrorNotification(errorMessage)
      return false
    }
  }

  const MINIMUM_PRICE_AND_AMOUNT = 1
  const MAX_PRICE_AND_AMOUNT = 2147483646
  if (productPrice.value <= MINIMUM_PRICE_AND_AMOUNT) {
    notificationModule.activeErrorNotification(`Inset A Valid Price! Minimum Is U$${MINIMUM_PRICE_AND_AMOUNT}`)
    return false
  }

  if (productPrice.value <= MINIMUM_PRICE_AND_AMOUNT) {
    notificationModule.activeErrorNotification(`Insert A Valid Stock! Minimum Is ${MINIMUM_PRICE_AND_AMOUNT}`)
    return false
  }

  if (productPrice.value > MAX_PRICE_AND_AMOUNT) {
    notificationModule.activeErrorNotification(`Inset A Valid Price! Maximum Is U$${MAX_PRICE_AND_AMOUNT}`)
    return false
  }

  if (productPrice.value > MAX_PRICE_AND_AMOUNT) {
    notificationModule.activeErrorNotification(`Insert A Valid Stock! Maximum Is ${MAX_PRICE_AND_AMOUNT}`)
    return false
  }

  const MAX_DESCRIPTION_LENGTH = 65535
  if (productsHash?.description && productsHash.description.length > MAX_DESCRIPTION_LENGTH) {
    notificationModule.activeErrorNotification(`Description Max Length Is ${MAX_DESCRIPTION_LENGTH}`)
    return false
  }

  return true
}

const validateAvailableStockInput = (event) => {
  const eventValue = event.target.value
  const regex = /^[0-9]+$/;

  if (regex.test(eventValue)) {
    productAvailableStock.value = Number(eventValue);
    return 
  }

  event.target.value = ''
  productAvailableStock.value = null
}

const formatProductPriceMock = () => {
  if (!modalInUpdateMode.value) return 

  productPriceMock.value = format(productPrice.value, moneyMaskSettingsmoneyConfig)
}

const unformatProductPriceMock = () => {
  productPrice.value = Number(unformat(productPriceMock.value, moneyMaskSettings))
}

const closeAndClearProductToUpdate = () => {
  emits('handleProdutManagementModalState')
  emits('setProductDataToUpdate')
}

const createProduct = async () => {
  if (!await validateProductData()) return
  
  const requestPayload = {
    name: productName.value,
    price: productPrice.value,
    available_stock: productAvailableStock.value,
    user_id: userId.value,
    ...productDescription.value && ({ description: productDescription.value })
  }

  const requestSucced = await productModule.requestCreateProduct(requestPayload)
  requestSucced && (closeAndClearProductToUpdate())
}

const updateProduct = async () => {
  if (!await validateProductData()) return
  
  const requestPayload = {
    name: productName.value,
    price: productPrice.value,
    available_stock: productAvailableStock.value,
    user_id: userId.value,
    product_id: productDataReference.value?.id,
    description: productDescription.value || null
  }

  const requestSucced = await productModule.requestUpdateProduct(requestPayload)
  requestSucced && (closeAndClearProductToUpdate())
}

watch(productPriceMock, () => {
  unformatProductPriceMock()
})

onMounted(() => {
  formatProductPriceMock()
})

</script>

<template>
<div class="modal d-block modal-background">
  <div class="modal-lg modal-dialog modal-dialog-centered">
    <div class="px-3 py-4 border-0 modal-content">
      <div class="modal-header d-flex align-items-center justify-content-between border-0">
        <h5 class="modal-title mb-0">{{  modalInUpdateMode ? 'Update' : 'Create'  }} Product</h5>
        <button @click="closeAndClearProductToUpdate" class="border-0 bg-transparent">
          <i class="bi fs-5 bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-body">
        <form class="d-flex flex-column gap-4">
          <div>
            <label>Name: </label>
            <input v-model="productName" class="form-control" />
          </div>
          <div>
            <label>Price: </label>
            <input v-money3="moneyMaskSettings" v-model.lazy="productPriceMock" class="form-control" />
          </div>
          <div>
            <label>Available Stock: </label>
            <input 
              :value="productAvailableStock"
              @input="event => validateAvailableStockInput(event)" 
              type="number" 
              step="1" 
              class="form-control" 
            />
          </div>
          <div>
            <label>Description: </label>
            <textarea 
              v-model="productDescription"
              rows="4"
              class="form-control"
            />
          </div>

        </form>
      </div>
      <div class="modal-footer border-0">
        <button @click="closeAndClearProductToUpdate" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="updateProduct" v-if="modalInUpdateMode" type="button" class="btn btn-dark">Update</button>
        <button @click="createProduct" v-else type="button" class="btn btn-dark">Create</button>
      </div>
    </div>
  </div>
</div>
</template>