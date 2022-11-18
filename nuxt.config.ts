// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,

    // nitro
    nitro: {
        preset: "vercel",
    },

    // css
    css: [
        '~/assets/style.scss',
        '~/assets/style.dark.scss',
    ],

    // env
    runtimeConfig: {
        // Default to an empty string, automatically set at runtime using process.env.NUXT_LOG_LEVEL
        logLevel: '',
        siyuanApiUrl: '',
        siyuanConfigToken: '',
        public: {
            middlewareUrl: ''
        }
    }
})
