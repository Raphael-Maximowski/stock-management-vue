<script setup lang="ts">
import { onMounted } from 'vue';
import { authStore } from './stores/authStore';

</script>

<template>
  <div class="vw-100 vh-100 overflow-auto">
    <RouterView />
  </div>
</template>

<style scoped></style>
