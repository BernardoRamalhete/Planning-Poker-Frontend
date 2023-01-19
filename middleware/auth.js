import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    if(!authStore.$authenticated) {
        navigateTo('/room/user?id=' + to.params.id)
    }
})