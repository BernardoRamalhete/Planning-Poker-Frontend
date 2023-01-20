import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()

    if(authStore.$authenticated) {
        if(!!to.query.id) {
            if(to.query.id !== 'find') {
                navigateTo('/room/' + to.query.id)
            }
        } else {
            navigateTo('/room/create')
        }
    }
})