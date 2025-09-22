<script setup lang="ts">
import { onMounted } from 'vue';
import { authStore } from './stores/authModule';


// const authModule = authStore()

// const tryLogin = async () => {
//   authModule.login({ email: 'teste.com@teste.com', password: 'aaaaa' })
// }

// onMounted(() => {
//   tryLogin()
// })

</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
