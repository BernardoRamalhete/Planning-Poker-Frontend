import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        API_RUL: useRuntimeConfig().public.API_URL + '/user/',
        authenticated: false,
        user: null
    }),
    getters: {
        $authenticated: (state) => state.authenticated,
        $user: (state) => state.user
    },
    actions: {
        async upsert(username) {
            try {
                const response = await $fetch(this.API_URL, { 
                    method: "POST",
                    header: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ username }) 
                })

                if(!("message" in response)) {
                    this.user = response
                    this.authenticated = true
                } else {
                    throw new Error(response.message)
                }
            } catch (error) {
                this.authenticated = false
                this.user = null
                console.error(error)
            }
        }
    },
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
            //maxAge: 30 days in seconds
            maxAge: 60 * 60 * 24 * 30
        }),
    },
});
