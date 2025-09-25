<script setup>
import { authStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const authModule = authStore()

const redirectToLoginView = () => {
    router.push({ name: 'AuthView' })
}

const tryLogout = async () => {
    await authModule.tryLogout()
    redirectToLoginView()
}
</script>

<template>
    <button @click="tryLogout" class="px-3 py-2 border-0 rounded-3">
             <i class="bi bi-box-arrow-left"></i>   
    </button>
</template>

<style scoped>
</style>