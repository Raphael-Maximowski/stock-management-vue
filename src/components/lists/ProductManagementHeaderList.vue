<script setup>
import { productStore } from '@/stores/productStore';
import { computed } from 'vue';

const productModule = productStore()

const activeItemsAmount = computed(() => productModule.getActiveProductsAmount)

</script>

<template>
    <ul class="d-flex align-items-center gap-3">
        <li>
            <p class="mb-0">Total Active Products: {{ activeItemsAmount }}</p>
        </li>
    </ul>
</template>
