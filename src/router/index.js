import { authStore } from '@/stores/authStore'
import { cartStore } from '@/stores/cartStore'
import { productStore } from '@/stores/productStore'
import { createRouter, createWebHistory } from 'vue-router'

const validateUserHasAccesToView = (allowedRole) => {
  const authModule = authStore()
  const userRole = authModule.getUserRole

  const userHaveAccesToView = allowedRole === userRole
  if (!userHaveAccesToView) {
    throw new Error("Cannot Access View")
  }
}

const requestProductsList = () => {
  try {
    const productModule = productStore()
    productModule.requestProductsData()
  } catch (error) {
    throw error
  }
}

const handleUserCart = async () => {
  const cartModule = cartStore()
  const authModule = authStore()
  const userId = authModule.getUserId

  try {
    const userCartExists = await cartModule.findUserCart(userId)
    if (!userCartExists) {
      cartModule.createUserCart({ user_id: userId })
    }
  } catch (error) {
    throw error
  }
  
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AuthView',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/products-management',
      name: 'ProductsManagement',
      component: () => import('@/views/ProductsManagementView.vue'),
      beforeEnter: async (to, from, next) => {
        try {
          await validateUserHasAccesToView('manager')
          await requestProductsList()

          next()
        } catch {
          next({ name: 'AuthView' })
        }
      }
    },
    {
      path: '/products-list',
      name: 'ProductsList',
      component: () => import('@/views/ProductsListView.vue'),
      beforeEnter: async (to, from, next) => {
        try {
          await validateUserHasAccesToView('client')
          await requestProductsList()
          await handleUserCart()

          next()
        } catch {
          next({ name: 'AuthView' })
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

export default router
