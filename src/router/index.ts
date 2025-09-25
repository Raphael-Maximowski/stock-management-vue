import { authStore } from '@/stores/authStore'
import { productStore } from '@/stores/productStore'
import { createRouter, createWebHistory } from 'vue-router'

const validateUserHasAccesToView = (allowedRole: string): boolean => {
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
          validateUserHasAccesToView('manager')
          requestProductsList()
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
          validateUserHasAccesToView('manager')
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
