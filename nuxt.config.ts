import ElementPlus from 'unplugin-element-plus/vite'

const isSiyuanBuild = process.env.BUILD_TYPE == "siyuan"
console.log("isSiyuanBuild=>", isSiyuanBuild)

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

    // vite
    vite: {
        plugins: [ElementPlus()],
    },

    app: {
        baseURL: isSiyuanBuild ? '/widgets/sy-post-publisher/' : "/",
        // 静态资源路径
        buildAssetsDir: "/static/"
    },

    experimental: {
        // 禁止api缓存
        payloadExtraction: false
    },

    // build
    build: {
        transpile: ['element-plus/es'],
    },

    // build modules
    modules: ['@vueuse/nuxt'],

    // auto import components
    components: true,

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
