import { authStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const validateUserHasAccesToView = (allowedRole: string, userRole: string | undefined): boolean => {
  return Boolean(allowedRole === userRole)
}

const createRoleGuard = (allowedRole: string) => {
  return async (to: any, from: any, next: any) => {
    const authModule = authStore()
    const userRole = authModule.getUserRole

    if (!validateUserHasAccesToView(allowedRole, userRole)) {
      next({ name: 'AuthView' })
      return
    }

    next()
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
      beforeEnter: createRoleGuard('manager')
    },
    {
      path: '/products-list',
      name: 'ProductsList',
      component: () => import('@/views/ProductsListView.vue'),
      beforeEnter: createRoleGuard('client')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

export default router
