<script setup>
import ProductCard from "@/components/cards/ProductCard.vue";
import Header from "@/components/headers/Header.vue"
import { productStore } from "@/stores/productStore";
import { computed } from "vue";

const productModule = productStore()
const productsData = computed(() => productModule.getProductsData)

</script>

<template>
    <div class="h-100 w-100 d-flex flex-column gap-4">
        <Header />
        <h3 class="fs-5">Products Available</h3>

        <div 
            v-if="Array.isArray(productsData) && productsData.length > 0"
            class="d-flex flex-column gap-3"
            >
            <ProductCard 
                v-for="product in productsData"
                :key="product.id"
                :product="product"
            />
        </div>

        <p v-else class="text-center">None Products Are Available!</p>
    </div>
</template>

<style scoped>

</style>