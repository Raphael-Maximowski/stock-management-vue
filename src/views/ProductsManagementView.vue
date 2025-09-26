<script setup>
import Header from "@/components/headers/Header.vue"
import ProductManagementModal from '@/components/modals/ProductManagementModal.vue';
import ProductsTable from '@/components/tables/ProductsTable.vue';
import { ref } from 'vue';

const productManagementModalState = ref(false)
const productDataToUpdate = ref(null)

const handleProdutManagementModalState = () => {
    productManagementModalState.value = !productManagementModalState.value
}

const setProductDataToUpdate = (productData = null) => {
    productDataToUpdate.value = productData
}

</script>

<template>
    <div class="h-100 w-100 d-flex flex-column gap-4">
        <Header />
        <ProductsTable 
            @handleProdutManagementModalState="handleProdutManagementModalState"
            @setProductDataToUpdate="setProductDataToUpdate"
        />
    </div>

    <ProductManagementModal 
        v-if="productManagementModalState"
        :productData="productDataToUpdate"
        @handleProdutManagementModalState="handleProdutManagementModalState"
        @setProductDataToUpdate="setProductDataToUpdate"
    />
</template>

<style scoped>

</style>