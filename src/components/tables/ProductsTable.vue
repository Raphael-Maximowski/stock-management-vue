<script setup>
import { productStore } from '@/stores/productStore';
import { formatTimestamp } from '@/utils/helpers';
import { computed } from 'vue';

const emits = defineEmits(['handleProdutManagementModalState', 'setProductDataToUpdate'])

const productModule = productStore()

const productsData = computed(() => productModule.getProductsData)

const confirmProductDeletion = () => {
  return window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
}

const deleteProduct = async (productId) => {
    if(await !confirmProductDeletion()) return
    productModule.requestDeleteProduct(productId)
}

const openModal = () => {
    emits('handleProdutManagementModalState')
}

const setProductDataToUpdate = (productData) => {
    emits('setProductDataToUpdate', productData)
}

const openModalAndSetDataToUpdate = (productData) => {
    setProductDataToUpdate(productData)
    openModal()
}
</script>

<template>
    <div class="flex-grow-1 d-flex flex-column table-wrapper rounded-4 overflow-hidden ">
        <div class="px-4 py-3 align-items-center d-flex justify-content-end table-top">
                <button @click="openModal" class="btn py-1 create-button btn-dark">
                    <i class="bi bi-plus-lg me-2"></i>
                    Create Product
                </button>
        </div>
        <div class="flex-grow-1 table-body-wrapper overflow-auto">
            <table class="w-100 table table-fixed">
                <thead>
                    <tr>
                        <th class="col-equal">Name</th> 
                        <th class="col-equal">Price</th>
                        <th class="col-equal">Available Stock</th>
                        <th class="col-equal">Reserved Stock</th>
                        <th class="col-equal" >Created At</th>
                        <th class="col-equal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in productsData"
                        :key="product.id"
                    >
                        <td>{{ product?.name || 'Product Name' }}</td>
                        <td>U$ {{ product?.price || 'Product Price' }}</td>
                        <td>{{ product?.available_stock || 0 }}</td>
                        <td>{{ product?.reserved_stock ||  0 }}</td>
                        <td>{{  formatTimestamp(product?.created_at) }}</td>
                        <td>
                            <button @click="openModalAndSetDataToUpdate(product)" class="me-3 border-0 bg-transparent">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button @click="deleteProduct(product.id)" class="border-0 bg-transparent">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.table-body-wrapper {
    height: 0px;
}

.table-wrapper {
    border-right: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
}

th, td {
    text-align: center;
    max-width: 300px;
    width: 14%;
    min-width: 200px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    vertical-align: middle;
}

.create-button {
    font-size: 14px;
}

.table-top {
    background-color: lightgray;
}
</style>