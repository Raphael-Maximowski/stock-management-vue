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
const productPriceMask = ref(null)

const MONEY_MASK_SETTINGS = { decimal: '.', thousands: ',', prefix: 'U$ ', precision: 2, masked: true }
const MINIMUM_PRICE_AND_AMOUNT = 1
const MAXIMUM_PRICE_AND_AMOUNT = 2147483646
const MAX_DESCRIPTION_LENGTH = 65535

const validateProductData = () => {
  const validations = [
    {
      condition: !productName.value?.trim(),
      message: "Product name is required",
      field: "name"
    },
    {
      condition: !productPrice.value,
      message: "Product price is required", 
      field: "price"
    },
    {
      condition: !productAvailableStock.value,
      message: "Available stock is required",
      field: "available_stock"
    },
    {
      condition: productName.value?.length > 255,
      message: "Product name max length is 255",
      field: "name"
    },
    {
      condition: productDescription.value?.length > MAX_DESCRIPTION_LENGTH,
      message: `Description max length is ${MAX_DESCRIPTION_LENGTH}`,
      field: "description"
    },
    {
      condition: isNaN(Number(productPrice.value)),
      message: "Price must be a valid number",
      field: "price"
    },
    {
      condition: Number(productPrice.value) < MINIMUM_PRICE_AND_AMOUNT,
      message: `Insert a valid price! Minimum is U$${MINIMUM_PRICE_AND_AMOUNT}`,
      field: "price"
    },
    {
      condition: Number(productPrice.value) > MAXIMUM_PRICE_AND_AMOUNT,
      message: `Insert a valid price! Maximum is U$${MAXIMUM_PRICE_AND_AMOUNT}`,
      field: "price"
    },
    {
      condition: isNaN(Number(productAvailableStock.value)),
      message: "Stock must be a valid number", 
      field: "available_stock"
    },
    {
      condition: Number(productAvailableStock.value) < MINIMUM_PRICE_AND_AMOUNT,
      message: `Insert a valid stock! Minimum is ${MINIMUM_PRICE_AND_AMOUNT}`,
      field: "available_stock"
    },
    {
      condition: Number(productAvailableStock.value) > MAXIMUM_PRICE_AND_AMOUNT,
      message: `Insert a valid stock! Maximum is ${MAXIMUM_PRICE_AND_AMOUNT}`,
      field: "available_stock"
    }
  ];

  const failedValidation = validations.find(validation => validation.condition);
  
  if (failedValidation) {
    notificationModule.activeErrorNotification(failedValidation.message);
    return false;
  }

  return true;
};

const handleAvailableStockInput = (event) => {
  const eventValue = event.target.value
  const regex = /^[0-9]+$/;

  if (regex.test(eventValue)) {
    productAvailableStock.value = Number(eventValue);
    return 
  }

  event.target.value = ''
  productAvailableStock.value = null
}

const setProductPriceMaskValue = () => {
  if (!modalInUpdateMode.value) return 
  productPriceMask.value = format(productPrice.value, MONEY_MASK_SETTINGS)
}

const setProductPriceValue = () => {
  productPrice.value = Number(unformat(productPriceMask.value, MONEY_MASK_SETTINGS))
}

const closeModal = () => {
  productDataReference.value && (emits('setProductDataToUpdate'))
  emits('handleProdutManagementModalState')
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
  requestSucced && (closeModal())
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
  requestSucced && (closeModal())
}

watch(productPriceMask, () => {
  setProductPriceValue()
})

onMounted(() => {
  setProductPriceMaskValue()
})

</script>

<template>
<div class="modal d-block modal-background">
  <div class="modal-lg modal-dialog modal-dialog-centered">
    <div class="px-3 py-4 border-0 modal-content">
      <div class="modal-header d-flex align-items-center justify-content-between border-0">
        <h5 class="modal-title mb-0">{{  modalInUpdateMode ? 'Update' : 'Create'  }} Product</h5>
        <button @click="closeModal" class="border-0 bg-transparent">
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
            <input v-money3="MONEY_MASK_SETTINGS" v-model.lazy="productPriceMask" class="form-control" />
          </div>
          <div>
            <label>Available Stock: </label>
            <input 
              :value="productAvailableStock"
              @input="event => handleAvailableStockInput(event)" 
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
        <button @click="closeModal" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="updateProduct" v-if="modalInUpdateMode" type="button" class="btn btn-dark">Update</button>
        <button @click="createProduct" v-else type="button" class="btn btn-dark">Create</button>
      </div>
    </div>
  </div>
</div>
</template>