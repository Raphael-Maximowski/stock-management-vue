<script setup lang="ts">
import { productStore } from '@/stores/productStore';
import { formatTimestamp } from '@/utils/helpers';
import { computed } from 'vue';

const productModule = productStore()
const productsData = computed(() => productModule.getProductsData)

</script>

<template>
    <div class="flex-grow-1 table-wrapper rounded-4 overflow-hidden ">
        <div class="px-4 py-3 align-items-center d-flex justify-content-end table-top">
                <button class="btn py-1 create-button btn-dark">
                    <i class="bi bi-plus-lg me-2"></i>
                    Create Product
                </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Available Stock</th>
                    <th>Reserved Stock</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in productsData"
                    :key="product.id"
                >
                    <td>{{ product?.name || 'Product Name' }}</td>
                    <td>U$ {{ product?.price || 'Product Price' }}</td>
                    <td>{{ product?.available_stock || 'Product Available Stock' }}</td>
                    <td>{{ product?.reserved_stock || 'Product Reserved Stock' }}</td>
                    <td>{{  formatTimestamp(product?.created_at) }}</td>
                    <td>
                        <button class="me-3 border-0 bg-transparent">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="border-0 bg-transparent">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table-wrapper {
    border-right: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
}

th, td {
    text-align: center;
}

.create-button {
    font-size: 14px;
}

.table-top {
    background-color: lightgray;
}
</style>