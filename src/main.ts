import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Vue3Toastify)

app.mount('#app')
