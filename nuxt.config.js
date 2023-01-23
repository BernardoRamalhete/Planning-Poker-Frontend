// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    head: {
        link: [
            { hid: 'icon', rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
        ]
    },
    runtimeConfig: {
        public: {
          API_URL: process.env.API_URL,
          SOCKET_URL: process.env.SOCKET_URL,
        }
    },
    modules: [
        'nuxt-icon',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        layoutTransition: { name: 'layout', mode: 'out-in' }
    },
    css: ['@/assets/scss/main.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/scss/variables.scss";'
                }
            }
        }
    }
})
