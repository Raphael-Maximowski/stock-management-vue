<script lang="ts" setup>
import { productStore } from '@/stores/productStore';
import LogoutButton from '../buttons/LogoutButton.vue';
import { computed } from 'vue';
import { authStore } from '@/stores/authStore';

const authModule = authStore()
const productModule = productStore()
const activeItemsAmount = computed(() => productModule.getActiveProductsAmount)
const userName = computed(() => authModule.getUserName)

</script>

<template>
    <header class="pb-4 gap-3 flex-wrap align-items-center d-flex justify-content-between">
        <h3 class="mb-0 fs-5" >Welcome {{ userName || 'User Name' }}!</h3>

        <div class="d-flex gap-5 align-items-center justify-between flex-wrap">
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