<script setup>
import { authStore } from '@/stores/authStore';
import { notificationStore } from '@/stores/notificationStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const notificationModule = notificationStore()
const authModule = authStore()
const router = useRouter()
const userRole = computed(() => authModule.getUserRole)
const formInLoginSection = computed(() => formSection.value === 'login')
const email = ref()
const password = ref()
const passwordConfirmation = ref()
const name = ref()
const userIsManager = ref(false)
const formSection = ref('login')

const handleFormSection = (section) => {
    formSection.value = section
}

const validateFormData = () => {
    const formData = {
        email: email.value,
        password: password.value,
        ...!formInLoginSection.value && { 
            passwordConfirmation: passwordConfirmation.value,
            name: name.value
        }
    }

    const formKeys = Object.keys(formData)

    for (const key of formKeys) {
        if (!formData[key]) {
            notificationModule.activeErrorNotification("All Fields Are Required")
            return false
        }

        if (formData[key].length >= 255) {
            notificationModule.activeErrorNotification("Max Fields Length Is 255")
            return false
        }
    }

    if (!formInLoginSection.value) {
        if (password.value.length < 8) {
            notificationModule.activeErrorNotification("Password Minimum Length is 8")
            return false
        }

        if (password.value !== passwordConfirmation.value) {
            notificationModule.activeErrorNotification("Password and Password Confirmation Must Be Equal")
            return false
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
    if (!emailRegex.test(email.value)) {
        notificationModule.activeErrorNotification("Please enter a valid email address")
        return false
    }

    return true
}

const tryLogin = async () => {
    if (!await validateFormData()) return

    const requestPayload = {
        email: email.value,
        password: password.value
    }

    const requestSuccess = await authModule.tryLogin(requestPayload)
    requestSuccess && (redirectToViewBasedInRole())
}

const tryRegister = async () => {
    if (!await validateFormData()) return

    const requestPayload = {
        email : email.value,
        password : password.value,
        password_confirmation : passwordConfirmation.value,
        name : name.value,
        role : userIsManager.value ? 'manager' : 'client'
    }

    const requestSuccess = await authModule.tryRegister(requestPayload)
    requestSuccess && (redirectToViewBasedInRole())
}


const redirectToViewBasedInRole = () => {
    const viewName = userRole.value === 'manager' ? 'ProductsManagement' : 'ProductsList'
    router.push({ name: viewName })
}

</script>

<template>
    <div class="w-100 h-100 d-flex justify-content-center align-items-center">
        <div class="bg-dark d-flex flex-column gap-3 text-white p-5 rounded-3">
        <h3 class="text-center mb-0 fs-3">Welcome</h3>
        
        <form class="d-flex flex-column gap-3">
            <input v-if="!formInLoginSection" v-model="name" class="form-control" placeholder="Name" />
            <input v-model="email" class="form-control" placeholder="Email" />
            <input v-model="password" class="form-control" placeholder="Password" />
            <input v-if="!formInLoginSection" v-model="passwordConfirmation" class="form-control" placeholder="Password Confirmation" />
            
            <label v-if="!formInLoginSection">
                <input v-model="userIsManager" type="checkbox" />
                Manager
            </label>

            <button @click="tryLogin" v-if="formInLoginSection" type="button" class="btn btn-light">Login</button>
            <button @click="tryRegister" v-else type="button" class="btn btn-light">Register</button>
        </form>
        <button v-if="!formInLoginSection" @click="handleFormSection('login')" class="secondary-button text-white border-0 bg-transparent">Do Login</button>
        <button v-else @click="handleFormSection('register')" class="secondary-button text-white border-0 bg-transparent" >Create Account</button>
    </div>
    </div>
</template>

<style scoped>
</style>