<script lang="ts" setup>
import { productStore } from '@/stores/productStore';
import LogoutButton from '../buttons/LogoutButton.vue';
import { computed } from 'vue';

const productModule = productStore()
const activeItemsAmount = computed(() => productModule.getActiveProductsAmount)

</script>

<template>
    <header class="pb-4 align-items-center d-flex justify-content-between">
        <h3 class="mb-0 fs-5" >Welcome User!</h3>

        <div class="d-flex gap-5 align-items-center flex-wrap">
            <p class="mb-0">Total Active Products: {{ activeItemsAmount }}</p>
            <LogoutButton />
        </div>
    </header>
</template>

<style scoped>
header {
    border-bottom: 1px solid lightgray;
}
</style>