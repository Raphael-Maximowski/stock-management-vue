<script setup lang="ts">
import ProductsManagementHeader from '@/components/headers/ProductsManagementHeader.vue';
import ProductsTable from '@/components/tables/ProductsTable.vue';
import { productStore } from '@/stores/productStore';
import { computed } from 'vue';

</script>

<template>
    <div class="h-100 w-100 d-flex flex-column gap-4">
        <ProductsManagementHeader />
        <ProductsTable />
    </div>
</template>

<style scoped>

</style>