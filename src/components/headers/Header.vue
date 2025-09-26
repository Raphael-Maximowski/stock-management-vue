<script setup>
import LogoutButton from '../buttons/LogoutButton.vue';
import { computed } from 'vue';
import { authStore } from '@/stores/authStore';
import ProductManagementHeaderList from '../lists/ProductManagementHeaderList.vue';
import ProductListHeaderList from '../lists/ProductListHeaderList.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const authModule = authStore()
const userName = computed(() => authModule.getUserName)

const renderList = (viewNameToRender) => {
    return Boolean(viewNameToRender == route.name)
}

</script>

<template>
    <header class="pb-4 gap-3 flex-wrap align-items-center d-flex justify-content-between">
        <h3 class="mb-0 fs-5" >Welcome {{ userName || 'User Name' }}!</h3>

        <div class="d-flex gap-5 align-items-center justify-between flex-wrap">
            <ProductManagementHeaderList v-if="renderList('ProductsManagement')"/>
            <ProductListHeaderList v-if="renderList('ProductsList')" />
            <LogoutButton />
        </div>
    </header>
</template>

<style scoped>
header {
    border-bottom: 1px solid lightgray;
}
</style>